import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import * as path from 'path';

// Load env from root directory
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

describe('PostgreSQL Client Service', () => {
  let client: Client;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: path.resolve(__dirname, '../../../../.env'),
          isGlobal: true,
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);

    const connectionString = configService.get<string>('DATABASE_URL') ||
      process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    client = new Client({
      connectionString,
    });

    await client.connect();
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  describe('Connection', () => {
    it('should successfully connect to PostgreSQL database', async () => {
      const result = await client.query('SELECT NOW() as now');
      expect(result.rows[0].now).toBeDefined();
      expect(new Date(result.rows[0].now)).toBeInstanceOf(Date);
    });

    it('should return correct PostgreSQL version', async () => {
      const result = await client.query('SELECT version() as version');
      expect(result.rows[0].version).toContain('PostgreSQL');
    });
  });

  describe('Database Operations', () => {
    const testTableName = 'test_posts_table';

    beforeEach(async () => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${testTableName} (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });

    afterEach(async () => {
      await client.query(`DROP TABLE IF EXISTS ${testTableName}`);
    });

    it('should create a table successfully', async () => {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = '${testTableName}'
        ) as exists
      `);
      expect(result.rows[0].exists).toBe(true);
    });

    it('should insert data successfully', async () => {
      const result = await client.query(
        `INSERT INTO ${testTableName} (title, content) VALUES ($1, $2) RETURNING *`,
        ['Test Title', 'Test Content']
      );
      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0].title).toBe('Test Title');
      expect(result.rows[0].content).toBe('Test Content');
    });

    it('should retrieve data successfully', async () => {
      await client.query(
        `INSERT INTO ${testTableName} (title, content) VALUES ($1, $2)`,
        ['Retrieve Test', 'Content to retrieve']
      );

      const result = await client.query(
        `SELECT * FROM ${testTableName} WHERE title = $1`,
        ['Retrieve Test']
      );
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].content).toBe('Content to retrieve');
    });

    it('should update data successfully', async () => {
      const insertResult = await client.query(
        `INSERT INTO ${testTableName} (title, content) VALUES ($1, $2) RETURNING id`,
        ['Update Test', 'Original Content']
      );

      const id = insertResult.rows[0].id;

      await client.query(
        `UPDATE ${testTableName} SET content = $1 WHERE id = $2`,
        ['Updated Content', id]
      );

      const result = await client.query(
        `SELECT * FROM ${testTableName} WHERE id = $1`,
        [id]
      );
      expect(result.rows[0].content).toBe('Updated Content');
    });

    it('should delete data successfully', async () => {
      const insertResult = await client.query(
        `INSERT INTO ${testTableName} (title, content) VALUES ($1, $2) RETURNING id`,
        ['Delete Test', 'Content to delete']
      );

      const id = insertResult.rows[0].id;

      await client.query(`DELETE FROM ${testTableName} WHERE id = $1`, [id]);

      const result = await client.query(
        `SELECT * FROM ${testTableName} WHERE id = $1`,
        [id]
      );
      expect(result.rows).toHaveLength(0);
    });
  });

  describe('Transaction Support', () => {
    const transactionTableName = 'test_transaction_table';

    beforeAll(async () => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${transactionTableName} (
          id SERIAL PRIMARY KEY,
          value VARCHAR(255) NOT NULL
        )
      `);
    });

    afterAll(async () => {
      await client.query(`DROP TABLE IF EXISTS ${transactionTableName}`);
    });

    afterEach(async () => {
      await client.query(`TRUNCATE TABLE ${transactionTableName}`);
    });

    it('should handle transactions - commit', async () => {
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO ${transactionTableName} (value) VALUES ($1)`,
          ['Transaction Test 1']
        );

        await client.query(
          `INSERT INTO ${transactionTableName} (value) VALUES ($1)`,
          ['Transaction Test 2']
        );

        await client.query('COMMIT');

        const result = await client.query(`SELECT * FROM ${transactionTableName}`);
        expect(result.rows).toHaveLength(2);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });

    it('should handle transactions - rollback on error', async () => {
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO ${transactionTableName} (value) VALUES ($1)`,
          ['Should Not Exist']
        );

        // Force an error - insert with wrong column name to trigger rollback
        await client.query(
          `INSERT INTO ${transactionTableName} (nonexistent_column) VALUES ($1)`,
          ['This will fail']
        );

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
      }

      const result = await client.query(
        `SELECT * FROM ${transactionTableName} WHERE value = $1`,
        ['Should Not Exist']
      );
      expect(result.rows).toHaveLength(0);
    });
  });

  describe('Connection Pool and Performance', () => {
    it('should handle multiple concurrent queries', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(client.query('SELECT pg_sleep(0.01), $1 as num', [i]));
      }

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        expect(result.rows[0].num).toBe(index.toString());
      });
    });
  });
});

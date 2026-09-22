import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateVideoDto } from './dto/index.js';
import { Pool } from 'pg';

export interface Video {
  id: string;
  title: string;
  duration: number;
}

@Injectable()
export class VideoService {
  private pool: Pool;

  constructor() {
    const host = process.env.DATABASE_HOST ?? 'postgres';
    const port = Number(process.env.DATABASE_PORT ?? 5432);
    const user = process.env.DATABASE_USER ?? 'itmo_user';
    const password = process.env.DATABASE_PASSWORD ?? 'itmo_pass';
    const database = process.env.DATABASE_NAME ?? 'itmo_db';

    this.pool = new Pool({ host, port, user, password, database });

    // Ensure table exists
    this.pool
      .query(
        `CREATE TABLE IF NOT EXISTS videos (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          duration INTEGER NOT NULL
        )`
      )
      .catch((err: unknown) => {
        console.error('Failed to ensure videos table exists', err);
      });
  }

  async findAll(): Promise<Video[]> {
    const res = await this.pool.query('SELECT id, title, duration FROM videos ORDER BY title');
    return res.rows as Video[];
  }

  async findOne(id: string): Promise<Video> {
    const res = await this.pool.query('SELECT id, title, duration FROM videos WHERE id = $1', [id]);

    if (res.rowCount === 0) {
      throw new NotFoundException('Video not found');
    }

    return res.rows[0] as Video;
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const id = randomUUID();
    const { title, duration } = createVideoDto;

    try {
      await this.pool.query('INSERT INTO videos(id, title, duration) VALUES($1, $2, $3)', [id, title, duration]);
      return { id, title, duration };
    } catch (err) {
      console.error('Failed to insert video', err);
      throw new InternalServerErrorException('Failed to create video');
    }
  }
}

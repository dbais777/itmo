import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/index.js';

export interface Video {
  id: string;
  title: string;
  duration: number;
}

@Injectable()
export class VideoService {
  private readonly videos: Video[] = [];

  findAll(): Video[] {
    return this.videos;
  }

  findOne(id: string): Video {
    const video = this.videos.find((item) => item.id === id);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  create(createVideoDto: CreateVideoDto): Video {
    const video: Video = {
      id: randomUUID(),
      title: createVideoDto.title,
      duration: createVideoDto.duration,
    };

    this.videos.push(video);

    return video;
  }
}

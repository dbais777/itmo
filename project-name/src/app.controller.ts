import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    // simple liveness/health endpoint
    // intentionally return 500 when the file /tmp/health-fail exists (used for testing)
    const fs = require('node:fs');
    if (fs.existsSync('/tmp/health-fail')) {
      throw new Error('health broken (simulated)');
    }
    return { status: 'ok' };
  }
}

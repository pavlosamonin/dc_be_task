import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService extends NestConfigService {
    constructor() {
        super();
    }

    get<T>(key: string, defaultValue?: T): T {
        return (super.get<T>(key) ?? defaultValue) as T;
    }

}

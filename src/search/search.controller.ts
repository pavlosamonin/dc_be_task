import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(@Inject(SearchService) private readonly searchService: SearchService) {}

    @Get()
    async search(@Query('text') searchText: string) {
        return this.searchService.searchFiles(searchText);
    }
}

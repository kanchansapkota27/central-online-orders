from ninja.pagination import PaginationBase
from ninja import Schema
from typing import List,Any
from django.conf import settings
import math



class CustomPagination(PaginationBase):

    class Input(Schema):
        page: int
    
    class Output(Schema):
        items:List[Any]
        total:int
        perPage:int
        totalPages:int
        currPage:int

    def paginate_queryset(self, queryset, pagination: Input, **params):
        page = pagination.page
        page_size = settings.CUSTOM_PAGINATION_PAGE_SIZE
        
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        
        data = queryset[start_index:end_index]
        
        total_count = queryset.count()
        total_pages = math.ceil(total_count / page_size)
        
        return {
            'items': data,
            'total': total_count, 
            'perPage': page_size,
            'currPage': page,
            'totalPages': total_pages
                }
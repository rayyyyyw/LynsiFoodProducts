<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'sort_order', 'flavors', 'price_list'];

    protected $casts = [
        'flavors' => 'array',      // e.g. ["BBQ", "Original"]
        'price_list' => 'array',   // e.g. [{"size":"50g","price":30},{"size":"100g","price":50}]
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function (Category $category) {
            if (empty($category->slug)) {
                $category->slug = \Illuminate\Support\Str::slug($category->name);
            }
        });
        static::updating(function (Category $category) {
            if (empty($category->slug)) {
                $category->slug = \Illuminate\Support\Str::slug($category->name);
            }
        });
    }
}

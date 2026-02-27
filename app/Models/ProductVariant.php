<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'size',
        'flavor',
        'price',
        'sku',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getDisplayNameAttribute(): string
    {
        // If size is a bare number (e.g. "100"), display it as "100g"
        $size = $this->size;
        if ($size !== null && preg_match('/^\d+(\.\d+)?$/', $size)) {
            $size = $size . 'g';
        }

        $parts = array_filter([$this->flavor, $size]);

        return implode(' – ', $parts) ?: 'Default';
    }
}

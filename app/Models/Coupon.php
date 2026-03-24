<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_subtotal',
        'usage_limit',
        'used_count',
        'is_active',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'value' => 'float',
        'min_subtotal' => 'float',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function isValidForSubtotal(float $subtotal): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($subtotal < $this->min_subtotal) {
            return false;
        }
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }
        $now = now();
        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }
        if ($this->ends_at && $now->gt($this->ends_at)) {
            return false;
        }

        return true;
    }

    public function computeDiscount(float $subtotal): float
    {
        if (! $this->isValidForSubtotal($subtotal)) {
            return 0.0;
        }

        return $this->type === 'percent'
            ? round(($subtotal * $this->value) / 100, 2)
            : min($this->value, $subtotal);
    }
}


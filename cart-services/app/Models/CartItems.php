<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItems extends Model
{
    protected $table = 'cart_items';

    protected $fillable = [
        'product_id',
        'name',
        'quantity',
        'price'
    ];
}

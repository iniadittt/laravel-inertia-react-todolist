<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class todo extends Model
{
    use HasFactory;
    protected $table = 'todos';
    protected $primaryKey = 'id';
    protected $guarded = [
        'id',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author', ownerKey: 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditRoundOne extends Model
{
    use HasFactory;
    protected $fillable = ['store_code', 'confirm', 'position', 'name', 'phone', 'user_id', 'report_id'];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_code');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

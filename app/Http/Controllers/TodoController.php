<?php

namespace App\Http\Controllers;

use App\Http\Requests\Todo\EditTodoRequest;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Models\todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authorId = Auth::user()->id;
        $todos = Todo::where('author', $authorId)->get();
        return Inertia::render('Todo/Page', [
            'todos' => $todos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        $author = Auth::user()->id;
        $todo = $request->validated();
        $todo['author'] = $author;
        Todo::create($todo);
        return Redirect::route('todo.index')->with('success', 'Todo created.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditTodoRequest $request, $id)
    {
        $authorId = Auth::user()->id;
        $todo = Todo::where('id', $id)->where('author', $authorId);
        if (!$todo) {
            return Redirect::route('todo.index')->with('error', 'Todo not found.');
        }
        $data = $request->validated();
        $todo->update($data);
        return redirect()->route('todo.index')->with('success', 'Todo updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $authorId = Auth::user()->id;
        $todo = Todo::where('id', $id)->where('author', $authorId);
        if (!$todo) {
            return Redirect::route('todo.index')->with('error', 'Todo not found.');
        }
        $todo->delete();
        return Redirect::route('todo.index')->with('success', 'Todo deleted.');
    }
}

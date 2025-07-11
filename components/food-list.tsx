"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "./shadcn/input";
import { Button } from "./shadcn/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { toast } from "sonner";
import { Toaster } from "./shadcn/sonner";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function FoodList() {
  const [foods, setFoods] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("foods");

    if (raw) {
      setFoods(JSON.parse(raw));
    }
  }, []);

  const addFood = (food: string) => {
    const updated = [food, ...foods];
    setFoods(updated);
  };

  const deleteFood = (index: number) => {
    const updated = [...foods];
    updated.splice(index, 1);
    setFoods(updated);
  };

  const saveFood = (food: string, index: number) => {
    const updated = [...foods];
    updated[index] = editValue.trim() === "" ? food : editValue.trim();
    setFoods(updated);
    setEditIndex(null);
  };

  function getRandom(): [string, number] {
    const maxIndex = foods.length;
    const randomIndex = Math.floor(Math.random() * maxIndex);

    return [foods[randomIndex], randomIndex];
  }

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const food = inputRef.current?.value;
    if (!food) return;

    addFood(toTitleCase(food));

    inputRef.current!.value = "";
  };

  const isValid = foods.length < 5;

  const alreadyPicked = new Set<number>();

  return (
    <div className="flex h-[400px] w-xs flex-col gap-2 overflow-auto px-4 md:w-sm">
      <Button
        variant={isValid ? "ghost" : "default"}
        onClick={() => {
          if (alreadyPicked.size === foods.length) {
            alreadyPicked.clear();
          }

          let picked: string;
          let index: number;

          do {
            [picked, index] = getRandom();
          } while (alreadyPicked.has(index));

          alreadyPicked.add(index);
          toast.success(`You got: ${picked}`);
        }}
        disabled={isValid}
      >
        {isValid ? "Add at least five foods!" : "Surprise me!"}
      </Button>

      <form
        onSubmit={handleFormSubmit}
        className="flex w-full items-center gap-2"
      >
        <Input
          className="max-w-[32ch]"
          name="food-input"
          ref={inputRef}
          type="text"
          placeholder="Add food here..."
          minLength={3}
          maxLength={60}
          required
        />
        <Button aria-label="Add Food" variant="outline">
          Add
        </Button>
      </form>

      <ul className="flex w-full flex-col items-stretch">
        {foods.map((f, i) => (
          <li className="flex items-center justify-between gap-2" key={i}>
            {editIndex === i ? (
              <Input
                className="max-w-[32ch]"
                name="edit-food-name"
                type="text"
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                }}
                onBlur={() => saveFood(f, i)}
                onKeyDown={(e) => e.key === "Enter" && saveFood(f, i)}
                autoFocus
              />
            ) : (
              <span className="max-w-[30ch] truncate">{f}</span>
            )}

            <div>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-1 text-zinc-400"
                aria-label="Edit Food"
                onClick={() => {
                  setEditIndex(i);
                  setEditValue(f);
                }}
              >
                <FiEdit />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400"
                onClick={() => deleteFood(i)}
                aria-label="Delete Food"
              >
                <FiTrash />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Toaster position="top-center" richColors />
    </div>
  );
}

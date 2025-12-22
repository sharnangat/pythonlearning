"""
Python Lists - Simple Explanation for Beginners
===============================================
A list is like a shopping bag where you can put multiple items and organize them.
"""

print("=" * 70)
print("PYTHON LISTS - SIMPLE EXPLANATION")
print("=" * 70)

# ============================================================================
# WHAT IS A LIST?
# ============================================================================
print("\n[1] WHAT IS A LIST?")
print("-" * 70)
print("""
Think of a list like a shopping list or a to-do list:
- You can write down multiple items
- Items are in order (first, second, third...)
- You can add new items
- You can remove items
- You can change items

In Python, a list is a collection of items stored in order.
""")

# ============================================================================
# CREATING A LIST
# ============================================================================
print("\n[2] CREATING A LIST")
print("-" * 70)
print("""
You create a list using square brackets []
Items are separated by commas
""")

# Example 1: List of fruits
fruits = ['apple', 'banana', 'orange']
print(f"\nExample 1 - Fruits list: {fruits}")

# Example 2: List of numbers
numbers = [1, 2, 3, 4, 5]
print(f"Example 2 - Numbers list: {numbers}")

# Example 3: Mixed types (you can mix different types!)
mixed = [1, 'hello', 3.14, True]
print(f"Example 3 - Mixed list: {mixed}")

# Example 4: Empty list
empty = []
print(f"Example 4 - Empty list: {empty}")

# ============================================================================
# ACCESSING ITEMS (Like reading your list)
# ============================================================================
print("\n\n[3] ACCESSING ITEMS")
print("-" * 70)
print("""
Lists use INDEXES (positions) starting from 0:
- First item is at position 0
- Second item is at position 1
- Third item is at position 2
- And so on...

You can also count from the end using negative numbers:
- Last item is at position -1
- Second last is at position -2
""")

shopping = ['milk', 'bread', 'eggs', 'butter', 'cheese']
print(f"\nShopping list: {shopping}")
print(f"  Position 0 (first item): {shopping[0]}")
print(f"  Position 1 (second item): {shopping[1]}")
print(f"  Position 2 (third item): {shopping[2]}")
print(f"  Position -1 (last item): {shopping[-1]}")
print(f"  Position -2 (second last): {shopping[-2]}")

# ============================================================================
# SLICING (Getting multiple items)
# ============================================================================
print("\n\n[4] SLICING (Getting Multiple Items)")
print("-" * 70)
print("""
You can get a portion of the list using slicing:
list[start:end] - Gets items from start to end (not including end)
""")

numbers = [10, 20, 30, 40, 50, 60]
print(f"\nNumbers list: {numbers}")
print(f"  First 3 items [0:3]: {numbers[0:3]}")
print(f"  From position 2 to end [2:]: {numbers[2:]}")
print(f"  First 4 items [:4]: {numbers[:4]}")
print(f"  Last 3 items [-3:]: {numbers[-3:]}")

# ============================================================================
# ADDING ITEMS
# ============================================================================
print("\n\n[5] ADDING ITEMS")
print("-" * 70)
print("""
There are different ways to add items:
1. append() - Add to the END
2. insert() - Add at a SPECIFIC POSITION
3. extend() - Add MULTIPLE items
""")

# Using append()
my_list = ['apple', 'banana']
print(f"\nStarting list: {my_list}")
my_list.append('orange')  # Adds to the end
print(f"After append('orange'): {my_list}")

# Using insert()
my_list.insert(1, 'grape')  # Insert at position 1
print(f"After insert(1, 'grape'): {my_list}")

# Using extend()
my_list.extend(['mango', 'pineapple'])
print(f"After extend(['mango', 'pineapple']): {my_list}")

# ============================================================================
# REMOVING ITEMS
# ============================================================================
print("\n\n[6] REMOVING ITEMS")
print("-" * 70)
print("""
There are different ways to remove items:
1. remove() - Remove by VALUE
2. pop() - Remove by POSITION (returns the item)
3. del - Delete by POSITION
""")

my_list = ['apple', 'banana', 'orange', 'grape', 'banana']
print(f"\nStarting list: {my_list}")

my_list.remove('banana')  # Removes first occurrence
print(f"After remove('banana'): {my_list}")

removed = my_list.pop(1)  # Remove item at position 1
print(f"After pop(1): {my_list}, removed item: {removed}")

del my_list[0]  # Delete item at position 0
print(f"After del my_list[0]: {my_list}")

# ============================================================================
# CHANGING ITEMS
# ============================================================================
print("\n\n[7] CHANGING ITEMS")
print("-" * 70)
print("""
You can change an item by assigning a new value to its position.
""")

colors = ['red', 'green', 'blue']
print(f"\nOriginal colors: {colors}")
colors[1] = 'yellow'  # Change item at position 1
print(f"After colors[1] = 'yellow': {colors}")

# ============================================================================
# USEFUL LIST OPERATIONS
# ============================================================================
print("\n\n[8] USEFUL LIST OPERATIONS")
print("-" * 70)

# Length
my_list = [1, 2, 3, 4, 5]
print(f"\nList: {my_list}")
print(f"Length (number of items): {len(my_list)}")

# Check if item exists
print(f"Is 3 in the list? {3 in my_list}")
print(f"Is 10 in the list? {10 in my_list}")

# Count occurrences
my_list = [1, 2, 2, 3, 2, 4]
print(f"\nList: {my_list}")
print(f"How many times is 2 in the list? {my_list.count(2)}")

# Find position
my_list = ['apple', 'banana', 'orange']
print(f"\nList: {my_list}")
print(f"Position of 'banana': {my_list.index('banana')}")

# Sort
numbers = [3, 1, 4, 1, 5, 9, 2]
print(f"\nUnsorted: {numbers}")
numbers.sort()
print(f"Sorted: {numbers}")

# Reverse
my_list = [1, 2, 3, 4, 5]
print(f"\nOriginal: {my_list}")
my_list.reverse()
print(f"Reversed: {my_list}")

# ============================================================================
# LOOPING THROUGH A LIST
# ============================================================================
print("\n\n[9] LOOPING THROUGH A LIST")
print("-" * 70)
print("""
You can go through each item in a list using a loop.
""")

fruits = ['apple', 'banana', 'orange']
print("\nMethod 1: Loop through items directly")
for fruit in fruits:
    print(f"  I like {fruit}")

print("\nMethod 2: Loop through with index")
for i, fruit in enumerate(fruits):
    print(f"  Position {i}: {fruit}")

# ============================================================================
# LIST COMPREHENSION (Advanced but useful)
# ============================================================================
print("\n\n[10] LIST COMPREHENSION (Quick Way to Create Lists)")
print("-" * 70)
print("""
List comprehension is a shorter way to create lists.
Instead of writing a loop, you can do it in one line!
""")

# Traditional way
squares_traditional = []
for x in range(1, 6):
    squares_traditional.append(x * x)
print(f"\nTraditional way: {squares_traditional}")

# List comprehension way (shorter!)
squares_comprehension = [x * x for x in range(1, 6)]
print(f"List comprehension way: {squares_comprehension}")

# With condition
even_squares = [x * x for x in range(1, 11) if x % 2 == 0]
print(f"Even squares only: {even_squares}")

# ============================================================================
# REAL-WORLD EXAMPLE
# ============================================================================
print("\n\n[11] REAL-WORLD EXAMPLE")
print("-" * 70)
print("""
Let's manage a simple to-do list!
""")

# Create a to-do list
todo_list = []

# Add tasks
todo_list.append("Buy groceries")
todo_list.append("Finish homework")
todo_list.append("Call mom")
todo_list.append("Exercise")

print(f"\nMy To-Do List:")
for i, task in enumerate(todo_list, 1):
    print(f"  {i}. {task}")

# Complete a task (remove it)
completed = todo_list.pop(0)
print(f"\nCompleted: {completed}")
print(f"Remaining tasks:")
for i, task in enumerate(todo_list, 1):
    print(f"  {i}. {task}")

# ============================================================================
# KEY TAKEAWAYS
# ============================================================================
print("\n\n" + "=" * 70)
print("KEY TAKEAWAYS")
print("=" * 70)
print("""
+ Lists store multiple items in order
+ Use square brackets [] to create lists
+ Access items using [position] (starts from 0)
+ Use append() to add to the end
+ Use remove() or pop() to remove items
+ Lists can contain any type of data
+ Lists are mutable (you can change them)
+ Use len() to get the number of items
+ Use 'in' to check if an item exists
+ Loop through lists with 'for' loop
""")

print("\n" + "=" * 70)
print("END OF LIST EXPLANATION")
print("=" * 70)


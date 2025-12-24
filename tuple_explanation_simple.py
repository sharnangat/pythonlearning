"""
Python Tuples - Simple Explanation for Beginners
================================================
A tuple is like a list, but IMMUTABLE (cannot be changed after creation).
Think of it as a locked box - once you put items in, you can't change them!
"""

print("=" * 70)
print("PYTHON TUPLES - SIMPLE EXPLANATION")
print("=" * 70)

# ============================================================================
# WHAT IS A TUPLE?
# ============================================================================
print("\n[1] WHAT IS A TUPLE?")
print("-" * 70)
print("""
A tuple is like a list, but with ONE KEY DIFFERENCE:
- Lists are MUTABLE (can be changed)
- Tuples are IMMUTABLE (cannot be changed after creation)

Think of it like this:
- List = A shopping bag (you can add/remove items)
- Tuple = A sealed package (items are fixed once created)

Why use tuples?
- Faster than lists
- Safer (can't accidentally change data)
- Can be used as dictionary keys
- Used for fixed data like coordinates, dates, etc.
""")

# ============================================================================
# CREATING A TUPLE
# ============================================================================
print("\n[2] CREATING A TUPLE")
print("-" * 70)
print("""
You create a tuple using parentheses () or just commas!
Items are separated by commas.
""")

# Method 1: Using parentheses
fruits = ('apple', 'banana', 'orange')
print(f"\nMethod 1 - Using parentheses: {fruits}")

# Method 2: Without parentheses (just commas)
colors = 'red', 'green', 'blue'
print(f"Method 2 - Without parentheses: {colors}")

# Method 3: Single item tuple (NOTE: Must have a comma!)
single = (42,)
print(f"Method 3 - Single item tuple: {single}")
print(f"  Type: {type(single)}")

# NOT a tuple (this is just a number!)
not_tuple = (42)
print(f"\nNOT a tuple (just a number): {not_tuple}")
print(f"  Type: {type(not_tuple)}")

# Empty tuple
empty = ()
print(f"\nEmpty tuple: {empty}")

# Mixed types
mixed = (1, 'hello', 3.14, True)
print(f"Mixed types tuple: {mixed}")

# ============================================================================
# ACCESSING ITEMS (Same as lists!)
# ============================================================================
print("\n\n[3] ACCESSING ITEMS")
print("-" * 70)
print("""
Accessing tuple items works EXACTLY like lists:
- Use square brackets [] with index
- Index starts from 0
- Can use negative indexes to count from end
""")

coordinates = (10, 20, 30, 40, 50)
print(f"\nCoordinates tuple: {coordinates}")
print(f"  First item [0]: {coordinates[0]}")
print(f"  Second item [1]: {coordinates[1]}")
print(f"  Last item [-1]: {coordinates[-1]}")
print(f"  Second last [-2]: {coordinates[-2]}")

# Slicing (same as lists!)
print(f"\nSlicing examples:")
print(f"  First 3 items [0:3]: {coordinates[0:3]}")
print(f"  From position 2 to end [2:]: {coordinates[2:]}")
print(f"  Last 3 items [-3:]: {coordinates[-3:]}")

# ============================================================================
# TUPLES ARE IMMUTABLE (Cannot be changed!)
# ============================================================================
print("\n\n[4] TUPLES ARE IMMUTABLE (Cannot be changed!)")
print("-" * 70)
print("""
This is the KEY difference from lists!
You CANNOT:
- Add items
- Remove items
- Change items
- Modify the tuple in any way

But you CAN:
- Access items
- Slice tuples
- Create new tuples from existing ones
""")

my_tuple = (1, 2, 3)
print(f"\nOriginal tuple: {my_tuple}")

# This will cause an error if uncommented:
# my_tuple[0] = 10  # ERROR! Cannot modify tuple
# my_tuple.append(4)  # ERROR! Tuples don't have append()

print("  Trying to change my_tuple[0] = 10 would cause an ERROR!")
print("  Trying to use my_tuple.append(4) would cause an ERROR!")

# But you can create a NEW tuple
new_tuple = my_tuple + (4, 5)
print(f"\nCreating NEW tuple from old one: {new_tuple}")
print(f"  Original tuple unchanged: {my_tuple}")

# ============================================================================
# TUPLE UNPACKING (Very useful!)
# ============================================================================
print("\n\n[5] TUPLE UNPACKING (Very useful!)")
print("-" * 70)
print("""
Tuple unpacking lets you assign tuple values to multiple variables at once.
This is one of the coolest features of tuples!
""")

# Basic unpacking
point = (3, 5)
x, y = point
print(f"\nPoint tuple: {point}")
print(f"Unpacked: x = {x}, y = {y}")

# Multiple values
person = ('Alice', 30, 'New York')
name, age, city = person
print(f"\nPerson tuple: {person}")
print(f"Unpacked: name = {name}, age = {age}, city = {city}")

# Swapping variables (super easy with tuples!)
a = 10
b = 20
print(f"\nBefore swap: a = {a}, b = {b}")
a, b = b, a  # Swap using tuple unpacking!
print(f"After swap: a = {a}, b = {b}")

# Returning multiple values from function
def get_name_age():
    return ('Bob', 25)

name, age = get_name_age()
print(f"\nFunction returned: name = {name}, age = {age}")

# ============================================================================
# TUPLES VS LISTS
# ============================================================================
print("\n\n[6] TUPLES VS LISTS")
print("-" * 70)
print("""
When to use TUPLES:
- When data should NOT change (coordinates, dates, constants)
- When you need to use it as a dictionary key
- When you want faster iteration
- When returning multiple values from a function

When to use LISTS:
- When you need to add/remove/modify items
- When order might change
- For general-purpose collections
""")

# Example: Coordinates (shouldn't change)
point = (10, 20)
print(f"\nExample - Coordinates (should be tuple): {point}")

# Example: Shopping list (should change)
shopping_list = ['milk', 'bread', 'eggs']
shopping_list.append('butter')
print(f"Example - Shopping list (should be list): {shopping_list}")

# ============================================================================
# TUPLES AS DICTIONARY KEYS
# ============================================================================
print("\n\n[7] TUPLES AS DICTIONARY KEYS")
print("-" * 70)
print("""
Tuples can be used as dictionary keys because they are immutable.
Lists CANNOT be used as keys because they are mutable.
""")

# Tuple as key (works!)
locations = {
    (0, 0): 'Origin',
    (1, 2): 'Point A',
    (3, 4): 'Point B'
}
print(f"\nDictionary with tuple keys: {locations}")
print(f"  Accessing (1, 2): {locations[(1, 2)]}")

# List as key (would cause error!)
# This would cause an error:
# locations_list = {
#     [0, 0]: 'Origin'  # ERROR! Lists can't be keys
# }
print("\n  Note: Lists cannot be dictionary keys (they're mutable)")

# ============================================================================
# TUPLE OPERATIONS
# ============================================================================
print("\n\n[8] TUPLE OPERATIONS")
print("-" * 70)

# Length
my_tuple = (1, 2, 3, 4, 5)
print(f"\nTuple: {my_tuple}")
print(f"Length: {len(my_tuple)}")

# Count occurrences
my_tuple = (1, 2, 2, 3, 2, 4)
print(f"\nTuple: {my_tuple}")
print(f"Count of 2: {my_tuple.count(2)}")

# Find index
my_tuple = ('apple', 'banana', 'orange')
print(f"\nTuple: {my_tuple}")
print(f"Index of 'banana': {my_tuple.index('banana')}")

# Check membership
my_tuple = (1, 2, 3, 4, 5)
print(f"\nTuple: {my_tuple}")
print(f"Is 3 in tuple? {3 in my_tuple}")
print(f"Is 10 in tuple? {10 in my_tuple}")

# Concatenation (creates NEW tuple)
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
combined = tuple1 + tuple2
print(f"\nTuple1: {tuple1}")
print(f"Tuple2: {tuple2}")
print(f"Combined: {combined}")
print(f"  Original tuples unchanged: {tuple1}, {tuple2}")

# Repetition
repeated = (1, 2) * 3
print(f"\n(1, 2) * 3 = {repeated}")

# ============================================================================
# LOOPING THROUGH TUPLES
# ============================================================================
print("\n\n[9] LOOPING THROUGH TUPLES")
print("-" * 70)
print("""
You can loop through tuples just like lists!
""")

fruits = ('apple', 'banana', 'orange')
print(f"\nTuple: {fruits}")

print("\nMethod 1: Loop through items")
for fruit in fruits:
    print(f"  I like {fruit}")

print("\nMethod 2: Loop with index")
for i, fruit in enumerate(fruits):
    print(f"  Position {i}: {fruit}")

# ============================================================================
# NESTED TUPLES
# ============================================================================
print("\n\n[10] NESTED TUPLES")
print("-" * 70)
print("""
Tuples can contain other tuples (nested tuples).
""")

# Nested tuple
matrix = ((1, 2, 3), (4, 5, 6), (7, 8, 9))
print(f"\nNested tuple (matrix): {matrix}")
print(f"  First row: {matrix[0]}")
print(f"  First element of first row: {matrix[0][0]}")

# Accessing nested elements
print("\nAccessing nested elements:")
for i, row in enumerate(matrix):
    print(f"  Row {i}: {row}")

# ============================================================================
# REAL-WORLD EXAMPLES
# ============================================================================
print("\n\n[11] REAL-WORLD EXAMPLES")
print("-" * 70)

# Example 1: Coordinates
print("\nExample 1: Coordinates (x, y)")
point1 = (10, 20)
point2 = (30, 40)
print(f"  Point 1: {point1}")
print(f"  Point 2: {point2}")

# Calculate distance (simplified)
x1, y1 = point1
x2, y2 = point2
distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
print(f"  Distance: {distance:.2f}")

# Example 2: RGB Colors
print("\nExample 2: RGB Colors")
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
print(f"  Red: {red}")
print(f"  Green: {green}")
print(f"  Blue: {blue}")

# Example 3: Student Records
print("\nExample 3: Student Records")
students = [
    ('Alice', 20, 'A'),
    ('Bob', 19, 'B'),
    ('Charlie', 21, 'A')
]
print("  Student Records:")
for name, age, grade in students:
    print(f"    {name}: Age {age}, Grade {grade}")

# Example 4: Function returning multiple values
print("\nExample 4: Function returning multiple values")
def divide_with_remainder(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

result = divide_with_remainder(17, 5)
q, r = result
print(f"  17 divided by 5: quotient = {q}, remainder = {r}")

# ============================================================================
# KEY TAKEAWAYS
# ============================================================================
print("\n\n" + "=" * 70)
print("KEY TAKEAWAYS")
print("=" * 70)
print("""
+ Tuples are IMMUTABLE (cannot be changed after creation)
+ Use parentheses () or just commas to create tuples
+ Single item tuple needs a comma: (42,)
+ Access items using [index] just like lists
+ Tuple unpacking is powerful: x, y = (10, 20)
+ Can be used as dictionary keys (lists cannot)
+ Faster than lists for iteration
+ Use tuples for fixed data (coordinates, dates, constants)
+ Use lists when you need to modify data
+ Can return multiple values from functions using tuples
""")

print("\n" + "=" * 70)
print("END OF TUPLE EXPLANATION")
print("=" * 70)


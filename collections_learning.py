"""
Python Collections Module - Learning Program
=============================================
This program demonstrates the various data structures available in Python's collections module.
"""

from collections import Counter, defaultdict, OrderedDict, deque, namedtuple, ChainMap

print("=" * 60)
print("PYTHON COLLECTIONS MODULE - LEARNING PROGRAM")
print("=" * 60)

# ============================================================================
# 1. COUNTER
# ============================================================================
print("\n1. COUNTER")
print("-" * 60)
print("Counter is a dictionary subclass for counting hashable objects.")

# Example 1: Counting characters in a string
text = "hello world"
char_counter = Counter(text)
print(f"\nCounting characters in '{text}':")
print(char_counter)
print(f"Most common 3 characters: {char_counter.most_common(3)}")

# Example 2: Counting elements in a list
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
num_counter = Counter(numbers)
print(f"\nCounting numbers in {numbers}:")
print(num_counter)
print(f"Count of 3: {num_counter[3]}")

# Example 3: Counter operations
counter1 = Counter(['a', 'b', 'c', 'a', 'b'])
counter2 = Counter(['a', 'b', 'b'])
print(f"\nCounter 1: {counter1}")
print(f"Counter 2: {counter2}")
print(f"Addition: {counter1 + counter2}")
print(f"Subtraction: {counter1 - counter2}")
print(f"Intersection: {counter1 & counter2}")
print(f"Union: {counter1 | counter2}")

# ============================================================================
# 2. DEFAULTDICT
# ============================================================================
print("\n\n2. DEFAULTDICT")
print("-" * 60)
print("defaultdict is a dictionary subclass that provides default values for missing keys.")

# Example 1: Defaultdict with list
dd_list = defaultdict(list)
dd_list['fruits'].append('apple')
dd_list['fruits'].append('banana')
dd_list['vegetables'].append('carrot')
print(f"\nDefaultdict with list: {dict(dd_list)}")
print(f"Accessing non-existent key 'meat': {dd_list['meat']}")  # Returns empty list

# Example 2: Defaultdict with int (for counting)
dd_int = defaultdict(int)
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
for word in words:
    dd_int[word] += 1
print(f"\nCounting words {words}:")
print(dict(dd_int))

# Example 3: Defaultdict with custom default factory
def default_factory():
    return "Not Found"

dd_custom = defaultdict(default_factory)
dd_custom['name'] = 'John'
print(f"\nCustom defaultdict: {dict(dd_custom)}")
print(f"Accessing non-existent key 'age': {dd_custom['age']}")

# ============================================================================
# 3. ORDEREDDICT
# ============================================================================
print("\n\n3. ORDEREDDICT")
print("-" * 60)
print("OrderedDict remembers the order in which items were inserted.")
print("Note: In Python 3.7+, regular dicts also maintain insertion order.")

# Creating an OrderedDict
od = OrderedDict()
od['first'] = 1
od['second'] = 2
od['third'] = 3
od['fourth'] = 4
print(f"\nOrderedDict: {dict(od)}")

# Moving items to end
od.move_to_end('first')
print(f"After moving 'first' to end: {dict(od)}")

# Pop last item
last_item = od.popitem(last=True)
print(f"Popped last item: {last_item}")
print(f"After pop: {dict(od)}")

# Pop first item
first_item = od.popitem(last=False)
print(f"Popped first item: {first_item}")
print(f"After pop: {dict(od)}")

# ============================================================================
# 4. DEQUE (Double-Ended Queue)
# ============================================================================
print("\n\n4. DEQUE (Double-Ended Queue)")
print("-" * 60)
print("deque is a list-like container with fast appends and pops on both ends.")

# Creating a deque
d = deque([1, 2, 3, 4, 5])
print(f"\nInitial deque: {list(d)}")

# Adding elements
d.append(6)  # Add to right
d.appendleft(0)  # Add to left
print(f"After append(6) and appendleft(0): {list(d)}")

# Removing elements
right = d.pop()  # Remove from right
left = d.popleft()  # Remove from left
print(f"Popped right: {right}, Popped left: {left}")
print(f"After pops: {list(d)}")

# Rotating deque
d.rotate(2)  # Rotate right by 2
print(f"After rotate(2): {list(d)}")
d.rotate(-1)  # Rotate left by 1
print(f"After rotate(-1): {list(d)}")

# Maximum length
limited_deque = deque([1, 2, 3], maxlen=3)
limited_deque.append(4)  # This will remove the leftmost element
print(f"\nLimited deque (maxlen=3) after append(4): {list(limited_deque)}")

# ============================================================================
# 5. NAMEDTUPLE
# ============================================================================
print("\n\n5. NAMEDTUPLE")
print("-" * 60)
print("namedtuple creates tuple subclasses with named fields.")

# Creating a namedtuple
Point = namedtuple('Point', ['x', 'y'])
p1 = Point(11, 22)
print(f"\nPoint namedtuple: {p1}")
print(f"Access by name: p1.x = {p1.x}, p1.y = {p1.y}")
print(f"Access by index: p1[0] = {p1[0]}, p1[1] = {p1[1]}")

# Another example
Person = namedtuple('Person', ['name', 'age', 'city'])
person1 = Person('Alice', 30, 'New York')
person2 = Person('Bob', 25, 'London')
print(f"\nPerson 1: {person1}")
print(f"Person 2: {person2}")
print(f"Person 1 name: {person1.name}, age: {person1.age}")

# Converting to dictionary
person_dict = person1._asdict()
print(f"Person as dict: {person_dict}")

# Replacing fields
person1_updated = person1._replace(age=31)
print(f"Updated person1 age: {person1_updated}")

# ============================================================================
# 6. CHAINMAP
# ============================================================================
print("\n\n6. CHAINMAP")
print("-" * 60)
print("ChainMap groups multiple dictionaries into a single mapping.")

# Creating ChainMaps
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
dict3 = {'d': 5}

chain = ChainMap(dict1, dict2, dict3)
print(f"\nChainMap from dict1={dict1}, dict2={dict2}, dict3={dict3}:")
print(f"ChainMap: {dict(chain)}")
print(f"Accessing 'a': {chain['a']}")  # From dict1
print(f"Accessing 'b': {chain['b']}")  # From dict1 (first match)
print(f"Accessing 'c': {chain['c']}")  # From dict2
print(f"Accessing 'd': {chain['d']}")  # From dict3

# Adding new child
chain = chain.new_child({'e': 6})
print(f"\nAfter adding new child with 'e': 6: {dict(chain)}")

# Accessing parents
print(f"Parents: {list(chain.parents)}")

# ============================================================================
# PRACTICAL EXAMPLES
# ============================================================================
print("\n\n" + "=" * 60)
print("PRACTICAL EXAMPLES")
print("=" * 60)

# Example 1: Word frequency counter
print("\nExample 1: Word Frequency Counter")
sentence = "the quick brown fox jumps over the lazy dog the fox"
word_counter = Counter(sentence.split())
print(f"Sentence: '{sentence}'")
print(f"Word frequencies: {dict(word_counter)}")
print(f"Most common 3 words: {word_counter.most_common(3)}")

# Example 2: Grouping data with defaultdict
print("\nExample 2: Grouping Students by Grade")
students = [
    ('Alice', 'A'),
    ('Bob', 'B'),
    ('Charlie', 'A'),
    ('David', 'C'),
    ('Eve', 'B'),
    ('Frank', 'A')
]
grade_groups = defaultdict(list)
for name, grade in students:
    grade_groups[grade].append(name)
print("Students grouped by grade:")
for grade, names in sorted(grade_groups.items()):
    print(f"  Grade {grade}: {', '.join(names)}")

# Example 3: Using deque for a simple queue
print("\nExample 3: Simple Queue using Deque")
queue = deque()
queue.append('task1')
queue.append('task2')
queue.append('task3')
print(f"Queue: {list(queue)}")
while queue:
    task = queue.popleft()
    print(f"  Processing: {task}")
print("  Queue is empty!")

# Example 4: Using namedtuple for structured data
print("\nExample 4: Managing Employee Records")
Employee = namedtuple('Employee', ['id', 'name', 'department', 'salary'])
employees = [
    Employee(1, 'John', 'IT', 75000),
    Employee(2, 'Jane', 'HR', 65000),
    Employee(3, 'Bob', 'IT', 80000)
]
print("Employee Records:")
for emp in employees:
    print(f"  {emp.name} ({emp.department}): ${emp.salary:,}")

print("\n" + "=" * 60)
print("END OF COLLECTIONS LEARNING PROGRAM")
print("=" * 60)


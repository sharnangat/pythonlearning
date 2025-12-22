"""
Python Data Structures - Learning Program
==========================================
This program demonstrates various data structures in Python with detailed explanations.
"""

print("=" * 70)
print("PYTHON DATA STRUCTURES - LEARNING PROGRAM")
print("=" * 70)

# ============================================================================
# 1. LISTS (Dynamic Arrays)
# ============================================================================
print("\n1. LISTS (Dynamic Arrays)")
print("-" * 70)
print("""
Lists are ordered, mutable (changeable) collections of items.
- Ordered: Items have a defined order
- Mutable: Can add, remove, or modify items
- Allow duplicates
- Indexed: Access items by position (0-based)
- Can contain mixed data types
""")

# Creating lists
fruits = ['apple', 'banana', 'cherry']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'hello', 3.14, True]

print(f"Fruits list: {fruits}")
print(f"Numbers list: {numbers}")
print(f"Mixed list: {mixed}")

# Accessing elements
print(f"\nFirst fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
print(f"Slicing [1:3]: {fruits[1:3]}")

# Modifying lists
fruits.append('orange')  # Add to end
print(f"After append('orange'): {fruits}")

fruits.insert(1, 'grape')  # Insert at position
print(f"After insert(1, 'grape'): {fruits}")

fruits.remove('banana')  # Remove first occurrence
print(f"After remove('banana'): {fruits}")

popped = fruits.pop()  # Remove and return last item
print(f"After pop(): {fruits}, popped item: {popped}")

# List operations
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2  # Concatenation
print(f"\nList concatenation: {list1} + {list2} = {combined}")

multiplied = [1, 2] * 3  # Repetition
print(f"List repetition: [1, 2] * 3 = {multiplied}")

# List comprehensions
squares = [x**2 for x in range(1, 6)]
print(f"List comprehension (squares): {squares}")

even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(f"List comprehension with condition: {even_squares}")

# ============================================================================
# 2. TUPLES
# ============================================================================
print("\n\n2. TUPLES")
print("-" * 70)
print("""
Tuples are ordered, immutable (unchangeable) collections of items.
- Ordered: Items have a defined order
- Immutable: Cannot modify after creation
- Allow duplicates
- Indexed: Access items by position
- Faster than lists for iteration
- Use parentheses () or just commas
""")

# Creating tuples
coordinates = (3, 5)
colors = ('red', 'green', 'blue')
single_item = (42,)  # Note the comma!
no_parentheses = 1, 2, 3  # Also valid

print(f"Coordinates: {coordinates}")
print(f"Colors: {colors}")
print(f"Single item tuple: {single_item}")
print(f"No parentheses tuple: {no_parentheses}")

# Accessing elements
print(f"\nFirst color: {colors[0]}")
print(f"Last color: {colors[-1]}")
print(f"Slicing [1:]: {colors[1:]}")

# Tuple unpacking
x, y = coordinates
print(f"\nUnpacking coordinates: x={x}, y={y}")

name, age, city = ('Alice', 30, 'NYC')
print(f"Unpacking person: name={name}, age={age}, city={city}")

# Tuple operations
tuple1 = (1, 2, 3)
tuple2 = (4, 5)
combined_tuple = tuple1 + tuple2
print(f"\nTuple concatenation: {tuple1} + {tuple2} = {combined_tuple}")

# ============================================================================
# 3. SETS
# ============================================================================
print("\n\n3. SETS")
print("-" * 70)
print("""
Sets are unordered collections of unique items.
- Unordered: No defined order
- Unique: No duplicate values
- Mutable: Can add/remove items
- Fast membership testing
- Use curly braces {} or set()
""")

# Creating sets
fruits_set = {'apple', 'banana', 'cherry'}
numbers_set = {1, 2, 3, 4, 5}
empty_set = set()  # Note: {} creates a dict, not a set!

print(f"Fruits set: {fruits_set}")
print(f"Numbers set: {numbers_set}")

# Adding/removing elements
fruits_set.add('orange')
print(f"After add('orange'): {fruits_set}")

fruits_set.remove('banana')  # Raises error if not found
print(f"After remove('banana'): {fruits_set}")

fruits_set.discard('grape')  # No error if not found
print(f"After discard('grape'): {fruits_set}")

# Set operations
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

union = set1 | set2  # or set1.union(set2)
intersection = set1 & set2  # or set1.intersection(set2)
difference = set1 - set2  # or set1.difference(set2)
symmetric_diff = set1 ^ set2  # or set1.symmetric_difference(set2)

print(f"\nSet1: {set1}")
print(f"Set2: {set2}")
print(f"Union: {union}")
print(f"Intersection: {intersection}")
print(f"Difference (set1 - set2): {difference}")
print(f"Symmetric difference: {symmetric_diff}")

# Membership testing
print(f"\nIs 3 in set1? {3 in set1}")
print(f"Is 9 in set1? {9 in set1}")

# ============================================================================
# 4. DICTIONARIES (Hash Maps)
# ============================================================================
print("\n\n4. DICTIONARIES (Hash Maps)")
print("-" * 70)
print("""
Dictionaries are unordered collections of key-value pairs.
- Key-value pairs: Each item has a key and a value
- Unordered (Python 3.7+ maintains insertion order)
- Mutable: Can add, modify, or remove items
- Keys must be unique and immutable (strings, numbers, tuples)
- Fast lookups by key
- Use curly braces {} with colons :
""")

# Creating dictionaries
student = {
    'name': 'Alice',
    'age': 20,
    'grade': 'A',
    'courses': ['Math', 'Science']
}

empty_dict = {}
dict_from_list = dict([('a', 1), ('b', 2)])

print(f"Student dictionary: {student}")
print(f"Dict from list: {dict_from_list}")

# Accessing values
print(f"\nStudent name: {student['name']}")
print(f"Student age: {student.get('age')}")
print(f"Student GPA (with default): {student.get('gpa', 'N/A')}")

# Modifying dictionaries
student['age'] = 21  # Update existing
student['gpa'] = 3.8  # Add new key
print(f"\nAfter modifications: {student}")

del student['grade']  # Remove key
print(f"After deleting 'grade': {student}")

# Dictionary methods
print(f"\nKeys: {list(student.keys())}")
print(f"Values: {list(student.values())}")
print(f"Items: {list(student.items())}")

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(1, 6)}
print(f"\nDictionary comprehension: {squares_dict}")

# ============================================================================
# 5. STACK (LIFO - Last In First Out)
# ============================================================================
print("\n\n5. STACK (LIFO - Last In First Out)")
print("-" * 70)
print("""
Stack is a linear data structure following LIFO principle.
- Operations: push (add), pop (remove), peek (view top)
- Can be implemented using list (append/pop) or collections.deque
- Use cases: Undo operations, expression evaluation, backtracking
""")

class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to top of stack"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return top item"""
        if self.is_empty():
            return None
        return self.items.pop()
    
    def peek(self):
        """Return top item without removing"""
        if self.is_empty():
            return None
        return self.items[-1]
    
    def is_empty(self):
        """Check if stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return size of stack"""
        return len(self.items)
    
    def __str__(self):
        return str(self.items)

# Using Stack
stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)
print(f"Stack after pushes: {stack}")
print(f"Stack size: {stack.size()}")
print(f"Top element (peek): {stack.peek()}")

popped = stack.pop()
print(f"Popped: {popped}, Stack: {stack}")

# Using list as stack (simpler)
list_stack = []
list_stack.append(1)
list_stack.append(2)
list_stack.append(3)
print(f"\nList as stack: {list_stack}")
print(f"Pop: {list_stack.pop()}, Remaining: {list_stack}")

# ============================================================================
# 6. QUEUE (FIFO - First In First Out)
# ============================================================================
print("\n\n6. QUEUE (FIFO - First In First Out)")
print("-" * 70)
print("""
Queue is a linear data structure following FIFO principle.
- Operations: enqueue (add to rear), dequeue (remove from front)
- Can be implemented using list or collections.deque (more efficient)
- Use cases: Task scheduling, BFS, print queues
""")

class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """Add item to rear of queue"""
        self.items.append(item)
    
    def dequeue(self):
        """Remove and return front item"""
        if self.is_empty():
            return None
        return self.items.pop(0)  # O(n) operation
    
    def front(self):
        """Return front item without removing"""
        if self.is_empty():
            return None
        return self.items[0]
    
    def is_empty(self):
        """Check if queue is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return size of queue"""
        return len(self.items)
    
    def __str__(self):
        return str(self.items)

# Using Queue
queue = Queue()
queue.enqueue('task1')
queue.enqueue('task2')
queue.enqueue('task3')
print(f"Queue after enqueues: {queue}")
print(f"Front element: {queue.front()}")

dequeued = queue.dequeue()
print(f"Dequeued: {dequeued}, Queue: {queue}")

# Using deque for efficient queue (recommended)
from collections import deque
efficient_queue = deque()
efficient_queue.append('task1')
efficient_queue.append('task2')
efficient_queue.append('task3')
print(f"\nDeque queue: {list(efficient_queue)}")
print(f"Dequeue: {efficient_queue.popleft()}, Remaining: {list(efficient_queue)}")

# ============================================================================
# 7. LINKED LIST
# ============================================================================
print("\n\n7. LINKED LIST")
print("-" * 70)
print("""
Linked List is a linear data structure with nodes connected by pointers.
- Each node contains data and reference to next node
- Dynamic size: Can grow/shrink at runtime
- No random access: Must traverse from head
- Efficient insertions/deletions at any position
- Types: Singly linked, Doubly linked, Circular
""")

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add node at the end"""
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node
    
    def prepend(self, data):
        """Add node at the beginning"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def display(self):
        """Display all nodes"""
        current = self.head
        elements = []
        while current:
            elements.append(str(current.data))
            current = current.next
        return ' -> '.join(elements) if elements else 'Empty'
    
    def delete(self, data):
        """Delete first occurrence of data"""
        if self.head is None:
            return
        
        if self.head.data == data:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next

# Using Linked List
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.prepend(5)
print(f"Linked List: {ll.display()}")

ll.delete(20)
print(f"After deleting 20: {ll.display()}")

# ============================================================================
# 8. BINARY TREE
# ============================================================================
print("\n\n8. BINARY TREE")
print("-" * 70)
print("""
Binary Tree is a hierarchical data structure.
- Each node has at most 2 children (left and right)
- Root: Topmost node
- Leaf: Node with no children
- Traversals: Inorder, Preorder, Postorder
- Use cases: Expression trees, decision trees, BST
""")

class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, data):
        """Insert node using level-order insertion"""
        if self.root is None:
            self.root = TreeNode(data)
            return
        
        queue = [self.root]
        while queue:
            node = queue.pop(0)
            if node.left is None:
                node.left = TreeNode(data)
                return
            elif node.right is None:
                node.right = TreeNode(data)
                return
            else:
                queue.append(node.left)
                queue.append(node.right)
    
    def inorder_traversal(self, node, result):
        """Left -> Root -> Right"""
        if node:
            self.inorder_traversal(node.left, result)
            result.append(node.data)
            self.inorder_traversal(node.right, result)
    
    def preorder_traversal(self, node, result):
        """Root -> Left -> Right"""
        if node:
            result.append(node.data)
            self.preorder_traversal(node.left, result)
            self.preorder_traversal(node.right, result)
    
    def postorder_traversal(self, node, result):
        """Left -> Right -> Root"""
        if node:
            self.postorder_traversal(node.left, result)
            self.postorder_traversal(node.right, result)
            result.append(node.data)
    
    def display_traversals(self):
        """Display all traversal methods"""
        inorder = []
        preorder = []
        postorder = []
        
        self.inorder_traversal(self.root, inorder)
        self.preorder_traversal(self.root, preorder)
        self.postorder_traversal(self.root, postorder)
        
        print(f"Inorder: {inorder}")
        print(f"Preorder: {preorder}")
        print(f"Postorder: {postorder}")

# Using Binary Tree
bt = BinaryTree()
for value in [1, 2, 3, 4, 5]:
    bt.insert(value)

print("Binary Tree Traversals:")
bt.display_traversals()

# ============================================================================
# 9. GRAPH (Adjacency List)
# ============================================================================
print("\n\n9. GRAPH (Adjacency List)")
print("-" * 70)
print("""
Graph is a collection of nodes (vertices) connected by edges.
- Vertices: Nodes in the graph
- Edges: Connections between vertices
- Can be directed or undirected
- Can be weighted or unweighted
- Representations: Adjacency list, Adjacency matrix
- Use cases: Social networks, maps, web pages
""")

class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_vertex(self, vertex):
        """Add a vertex to the graph"""
        if vertex not in self.graph:
            self.graph[vertex] = []
    
    def add_edge(self, vertex1, vertex2, directed=False):
        """Add an edge between two vertices"""
        if vertex1 not in self.graph:
            self.add_vertex(vertex1)
        if vertex2 not in self.graph:
            self.add_vertex(vertex2)
        
        self.graph[vertex1].append(vertex2)
        if not directed:
            self.graph[vertex2].append(vertex1)
    
    def display(self):
        """Display the graph"""
        for vertex in self.graph:
            print(f"  {vertex}: {self.graph[vertex]}")
    
    def dfs(self, start, visited=None):
        """Depth-First Search"""
        if visited is None:
            visited = set()
        visited.add(start)
        result = [start]
        
        for neighbor in self.graph.get(start, []):
            if neighbor not in visited:
                result.extend(self.dfs(neighbor, visited))
        return result
    
    def bfs(self, start):
        """Breadth-First Search"""
        visited = set()
        queue = [start]
        result = []
        
        while queue:
            vertex = queue.pop(0)
            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)
                queue.extend([v for v in self.graph.get(vertex, []) if v not in visited])
        
        return result

# Using Graph
g = Graph()
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'D')
g.add_edge('D', 'E')

print("Graph (Adjacency List):")
g.display()

print(f"\nDFS starting from 'A': {g.dfs('A')}")
print(f"BFS starting from 'A': {g.bfs('A')}")

# ============================================================================
# COMPARISON TABLE
# ============================================================================
print("\n\n" + "=" * 70)
print("DATA STRUCTURE COMPARISON")
print("=" * 70)
print("""
Data Structure    | Ordered | Mutable | Duplicates | Indexed | Use Case
------------------|---------|---------|------------|---------|------------------
List              |   Yes   |   Yes   |    Yes     |   Yes   | General purpose
Tuple             |   Yes   |   No    |    Yes     |   Yes   | Immutable data
Set               |   No    |   Yes   |    No      |   No    | Unique items
Dictionary        |   Yes*  |   Yes   |    No**    |   No    | Key-value pairs
Stack             |   Yes   |   Yes   |    Yes     |   No    | LIFO operations
Queue             |   Yes   |   Yes   |    Yes     |   No    | FIFO operations
Linked List       |   Yes   |   Yes   |    Yes     |   No    | Dynamic size
Binary Tree       |   No    |   Yes   |    Yes     |   No    | Hierarchical data
Graph             |   No    |   Yes   |    Yes     |   No    | Relationships

* Python 3.7+ maintains insertion order
** Keys must be unique, values can duplicate
""")

print("\n" + "=" * 70)
print("END OF DATA STRUCTURES LEARNING PROGRAM")
print("=" * 70)


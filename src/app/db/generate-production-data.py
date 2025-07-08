from faker import Faker
import random
import uuid
from collections import Counter

fake = Faker()
Faker.seed(42)
random.seed(42)

NUM_USERS = 800
NUM_LISTINGS = 1500
ADMIN_RATIO = 10  # 1 admin per 10 users (approximately 80 admins for 800 users)

product_types = ['School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc']
product_conditions = ['new', 'like new', 'gently used', 'fair', 'poor']
statuses = ['for sale', 'pending', 'sold']

programs = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Software Engineering', 'Math', 'Physics', 'Chemical Engineering',
    'Civil Engineering', 'Systems Design Engineering', 'Management Engineering',
    'Biomedical Engineering', 'Architecture', 'Planning', 'Environment',
    'Arts', 'Science', 'Engineering', 'Mathematics'
]

locations = [
    'UWaterloo SLC', 'UWaterloo Dana Porter Library', 'UWaterloo Student Centre',
    'Village 1', 'Village 2', 'Columbia Lake Village', 'Off-campus housing near Columbia',
    'Off-campus housing near University', 'UWaterloo Campus', 'Student Housing Complex',
    'University Plaza', 'Waterloo Park', 'Downtown Waterloo', 'Kitchener Campus'
]

product_data = {
    'School Supplies': {
        'items': ['Textbook', 'Notebook', 'Calculator', 'Pen Set', 'Backpack', 'Binder', 'Stapler', 'Highlighter Set', 'Pencil Case', 'Ruler', 'Scissors', 'Index Cards', 'Whiteboard', 'Markers', 'Paper Clips', 'Rubber Bands', 'Tape Dispenser', 'File Folder', 'Sticky Notes'],
        'price_range': (5, 150),
        'descriptions': [
            'Perfect for university students',
            'Used for one term, some highlights',
            'Great condition, barely used',
            'Essential for your studies',
            'Comes with all accessories',
            'Bought for class but never used',
            'Excellent study companion',
            'Professional quality materials',
            'Great for note-taking',
            'Complete set with extras'
        ]
    },
    'Furniture': {
        'items': ['Chair', 'Desk', 'Bookshelf', 'Bed Frame', 'Dresser', 'Table', 'Lamp', 'Storage Unit', 'Bean Bag', 'Ottoman', 'Nightstand', 'Wardrobe', 'Shoe Rack', 'TV Stand', 'Coffee Table', 'Dining Table', 'Bar Stool', 'Futon', 'Hammock', 'Wall Shelf', 'Coat Rack', 'Mirror Stand', 'Plant Stand', 'Footrest'],
        'price_range': (20, 300),
        'descriptions': [
            'Sturdy and clean',
            'Perfect for student housing',
            'Easy to assemble',
            'Great condition',
            'Space-saving design',
            'Modern minimalist style',
            'Comfortable and ergonomic',
            'Multi-functional piece',
            'Durable construction',
            'Easy to move around',
            'Perfect for small spaces',
            'High-quality materials',
            'Versatile design',
            'Great for studying'
        ]
    },
    'Kitchen': {
        'items': ['Toaster', 'Microwave', 'Coffee Maker', 'Blender', 'Rice Cooker', 'Kettle', 'Dish Set', 'Utensils', 'Air Fryer', 'Slow Cooker', 'Food Processor', 'Mixer', 'Juicer', 'Waffle Maker', 'Panini Press', 'Electric Grill', 'Steamer', 'Pressure Cooker', 'Baking Sheets', 'Mixing Bowls', 'Cutting Board', 'Knife Set', 'Measuring Cups', 'Spatula Set', 'Colander', 'Strainer', 'Can Opener', 'Peeler', 'Grater'],
        'price_range': (10, 200),
        'descriptions': [
            'Still works perfectly, just upgraded',
            'Great for cooking meals',
            'Essential kitchen appliance',
            'Perfect for small kitchens',
            'Barely used, like new',
            'Professional grade quality',
            'Easy to clean and maintain',
            'Energy efficient model',
            'Compact and portable',
            'Great for meal prep',
            'Perfect for dorm cooking',
            'Multi-function appliance',
            'Stainless steel construction',
            'Digital controls',
            'Safety features included'
        ]
    },
    'Electronics': {
        'items': ['Laptop', 'Phone', 'Tablet', 'Bluetooth Speaker', 'Headphones', 'Monitor', 'Keyboard', 'Mouse', 'Webcam', 'Microphone', 'USB Hub', 'Power Bank', 'Charger', 'Cable Set', 'Router', 'Switch', 'Hard Drive', 'SSD', 'RAM', 'Graphics Card', 'CPU', 'Motherboard', 'Case', 'Power Supply', 'Cooling Fan', 'LED Strip', 'Smart Bulb', 'Smart Plug', 'Fitness Tracker', 'Smartwatch', 'E-reader', 'Portable Charger', 'Wireless Earbuds', 'Gaming Controller', 'VR Headset', 'Drone', 'Camera', 'Tripod', 'Printer', 'Scanner'],
        'price_range': (50, 800),
        'descriptions': [
            'Bass heavy, battery still good',
            'Perfect for online classes',
            'Great for gaming and work',
            'High-quality audio',
            'Fast and reliable',
            'Latest model with warranty',
            'Excellent performance',
            'Energy efficient',
            'Wireless connectivity',
            'Portable and lightweight',
            'Professional grade',
            'Great for streaming',
            'High resolution display',
            'Long battery life',
            'Easy to set up',
            'Compatible with all devices',
            'Premium build quality',
            'Advanced features included',
            'Perfect for remote work',
            'Gaming optimized'
        ]
    },
    'Clothing': {
        'items': ['Jacket', 'Shoes', 'Backpack', 'Dress', 'Shirt', 'Pants', 'Hat', 'Scarf', 'Sweater', 'Hoodie', 'Jeans', 'Shorts', 'Skirt', 'Blouse', 'T-shirt', 'Tank Top', 'Cardigan', 'Blazer', 'Suit', 'Tie', 'Belt', 'Socks', 'Underwear', 'Pajamas', 'Robe', 'Swimsuit', 'Winter Coat', 'Rain Jacket', 'Windbreaker', 'Vest', 'Gloves', 'Mittens', 'Boots', 'Sneakers', 'Sandals', 'Heels', 'Flats', 'Loafers', 'Oxfords', 'Athletic Wear', 'Yoga Pants', 'Sports Bra', 'Running Shoes', 'Hiking Boots', 'Formal Dress', 'Casual Dress', 'Party Dress', 'Work Outfit', 'Interview Outfit'],
        'price_range': (5, 100),
        'descriptions': [
            'Perfect for university life',
            'Great for all seasons',
            'Comfortable and stylish',
            'Barely worn',
            'High-quality material',
            'Trendy design',
            'Professional appearance',
            'Easy to care for',
            'Versatile styling',
            'Perfect fit',
            'Durable construction',
            'Breathable fabric',
            'Wrinkle resistant',
            'Stain resistant',
            'Quick dry material',
            'Eco-friendly fabric',
            'Classic style',
            'Modern cut',
            'Great for layering',
            'Perfect for campus'
        ]
    },
    'Misc': {
        'items': ['Hair Dryer', 'Fan', 'Mirror', 'Rug', 'Plant', 'Clock', 'Picture Frame', 'Storage Box', 'Laundry Basket', 'Hangers', 'Iron', 'Ironing Board', 'Vacuum', 'Broom', 'Mop', 'Cleaning Supplies', 'Trash Can', 'Recycling Bin', 'Shower Curtain', 'Towels', 'Bedding', 'Pillows', 'Blanket', 'Throw', 'Curtains', 'Blinds', 'Wall Art', 'Posters', 'Books', 'Magazines', 'Board Games', 'Puzzles', 'Cards', 'Dice', 'Sports Equipment', 'Bicycle', 'Skateboard', 'Rollerblades', 'Tent', 'Sleeping Bag', 'Backpack', 'Luggage', 'Umbrella', 'Sunglasses', 'Jewelry', 'Watch', 'Wallet', 'Purse', 'Makeup', 'Skincare', 'Hair Products', 'Shampoo', 'Conditioner', 'Soap', 'Toothbrush', 'Toothpaste', 'Deodorant', 'Perfume', 'Cologne', 'Nail Polish', 'Hair Accessories', 'Sunglasses Case', 'Phone Case', 'Laptop Sleeve', 'Water Bottle', 'Thermos', 'Lunch Box', 'Food Containers', 'Ziploc Bags', 'Aluminum Foil', 'Plastic Wrap', 'Paper Towels', 'Toilet Paper', 'Tissues', 'Hand Sanitizer', 'First Aid Kit', 'Bandages', 'Vitamins', 'Medicine', 'Thermometer', 'Scale', 'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Foam Roller', 'Massage Ball', 'Stretching Strap', 'Meditation Cushion', 'Incense', 'Candles', 'Essential Oils', 'Diffuser', 'Humidifier', 'Dehumidifier', 'Air Purifier', 'Space Heater', 'Air Conditioner', 'Deck of Cards', 'Chess Set', 'Checkers', 'Dominoes', 'Jenga', 'Twister', 'Scrabble', 'Monopoly', 'Risk', 'Settlers of Catan', 'Ticket to Ride', 'Codenames', 'Cards Against Humanity', 'Uno', 'Skip-Bo', 'Phase 10', 'Rummy', 'Poker Chips', 'Dart Board', 'Pool Cues', 'Table Tennis', 'Badminton Set', 'Volleyball', 'Basketball', 'Soccer Ball', 'Football', 'Baseball', 'Tennis Racket', 'Golf Clubs', 'Fishing Rod', 'Telescope', 'Microscope', 'Binoculars', 'Compass', 'Map', 'Globe', 'Atlas', 'Dictionary', 'Thesaurus', 'Encyclopedia', 'Novels', 'Textbooks', 'Magazines', 'Newspapers', 'Comics', 'Manga', 'Graphic Novels', 'Poetry Books', 'Cookbooks', 'Travel Guides', 'Language Books', 'Workbooks', 'Coloring Books', 'Art Supplies', 'Paint', 'Brushes', 'Canvas', 'Sketchbook', 'Pencils', 'Charcoal', 'Pastels', 'Markers', 'Crayons', 'Glue', 'Tape', 'Scissors', 'Ruler', 'Protractor', 'Compass', 'Calculator', 'Abacus', 'Slide Rule', 'Typewriter', 'Record Player', 'Cassette Player', 'CD Player', 'MP3 Player', 'iPod', 'Walkman', 'Discman', 'VHS Player', 'DVD Player', 'Blu-ray Player', 'VCR', 'Projector', 'Screen', 'Whiteboard', 'Chalkboard', 'Easel', 'Mannequin', 'Display Case', 'Showcase', 'Rack', 'Shelf', 'Drawer', 'Cabinet', 'Wardrobe', 'Closet', 'Pantry', 'Linen Closet', 'Medicine Cabinet', 'Tool Box', 'Tool Kit', 'Tool Belt', 'Workbench', 'Vise', 'Clamp', 'Screwdriver', 'Wrench', 'Pliers', 'Hammer', 'Saw', 'Drill', 'Sander', 'Grinder', 'Welder', 'Soldering Iron', 'Multimeter', 'Oscilloscope', 'Function Generator', 'Power Supply', 'Breadboard', 'Resistors', 'Capacitors', 'Inductors', 'Diodes', 'Transistors', 'ICs', 'LEDs', 'Switches', 'Buttons', 'Potentiometers', 'Sensors', 'Actuators', 'Motors', 'Servos', 'Steppers', 'Relays', 'Transformers', 'Batteries', 'Chargers', 'Inverters', 'Converters', 'Regulators', 'Filters', 'Amplifiers', 'Oscillators', 'Mixers', 'Modulators', 'Demodulators', 'Encoders', 'Decoders', 'Multiplexers', 'Demultiplexers', 'Flip-flops', 'Latches', 'Counters', 'Registers', 'Memory', 'ROM', 'RAM', 'EEPROM', 'Flash', 'Hard Drive', 'SSD', 'CD', 'DVD', 'Blu-ray', 'USB', 'SD Card', 'MicroSD', 'CompactFlash', 'SmartMedia', 'xD Picture Card', 'Memory Stick', 'MiniDisc', 'Zip Disk', 'Floppy Disk', 'Tape', 'Punch Card', 'Paper Tape', 'Magnetic Tape', 'Optical Disk', 'Holographic Storage', 'Quantum Storage', 'DNA Storage', 'Molecular Storage', 'Atomic Storage', 'Subatomic Storage', 'Quantum Storage', 'Holographic Storage', 'Optical Storage', 'Magnetic Storage', 'Electronic Storage', 'Mechanical Storage', 'Chemical Storage', 'Biological Storage', 'Physical Storage', 'Digital Storage', 'Analog Storage', 'Hybrid Storage', 'Cloud Storage', 'Local Storage', 'Remote Storage', 'Distributed Storage', 'Centralized Storage', 'Decentralized Storage', 'Federated Storage', 'Hierarchical Storage', 'Flat Storage', 'Structured Storage', 'Unstructured Storage', 'Semi-structured Storage', 'Relational Storage', 'Non-relational Storage', 'Object Storage', 'File Storage', 'Block Storage', 'Stream Storage', 'Batch Storage', 'Real-time Storage', 'Near-line Storage', 'Offline Storage', 'Online Storage', 'Nearline Storage', 'Archive Storage', 'Backup Storage', 'Primary Storage', 'Secondary Storage', 'Tertiary Storage', 'Quaternary Storage', 'Primary Memory', 'Secondary Memory', 'Cache Memory', 'Virtual Memory', 'Physical Memory', 'Logical Memory', 'Shared Memory', 'Distributed Memory', 'Parallel Memory', 'Serial Memory', 'Synchronous Memory', 'Asynchronous Memory', 'Static Memory', 'Dynamic Memory', 'Volatile Memory', 'Non-volatile Memory', 'Read-only Memory', 'Read-write Memory', 'Random Access Memory', 'Sequential Access Memory', 'Direct Access Memory', 'Associative Memory', 'Content-addressable Memory', 'Associative Storage', 'Content-addressable Storage', 'Hash-based Storage', 'Tree-based Storage', 'Graph-based Storage', 'Network Storage', 'Grid Storage', 'Cluster Storage', 'Array Storage', 'Matrix Storage', 'Vector Storage', 'Scalar Storage', 'Tensor Storage', 'Quantum Storage', 'Holographic Storage', 'Optical Storage', 'Magnetic Storage', 'Electronic Storage', 'Mechanical Storage', 'Chemical Storage', 'Biological Storage', 'Physical Storage', 'Digital Storage', 'Analog Storage', 'Hybrid Storage', 'Cloud Storage', 'Local Storage', 'Remote Storage', 'Distributed Storage', 'Centralized Storage', 'Decentralized Storage', 'Federated Storage', 'Hierarchical Storage', 'Flat Storage', 'Structured Storage', 'Unstructured Storage', 'Semi-structured Storage', 'Relational Storage', 'Non-relational Storage', 'Object Storage', 'File Storage', 'Block Storage', 'Stream Storage', 'Batch Storage', 'Real-time Storage', 'Near-line Storage', 'Offline Storage', 'Online Storage', 'Nearline Storage', 'Archive Storage', 'Backup Storage', 'Primary Storage', 'Secondary Storage', 'Tertiary Storage', 'Quaternary Storage', 'Primary Memory', 'Secondary Memory', 'Cache Memory', 'Virtual Memory', 'Physical Memory', 'Logical Memory', 'Shared Memory', 'Distributed Memory', 'Parallel Memory', 'Serial Memory', 'Synchronous Memory', 'Asynchronous Memory', 'Static Memory', 'Dynamic Memory', 'Volatile Memory', 'Non-volatile Memory', 'Read-only Memory', 'Read-write Memory', 'Random Access Memory', 'Sequential Access Memory', 'Direct Access Memory', 'Associative Memory', 'Content-addressable Memory', 'Associative Storage', 'Content-addressable Storage', 'Hash-based Storage', 'Tree-based Storage', 'Graph-based Storage', 'Network Storage', 'Grid Storage', 'Cluster Storage', 'Array Storage', 'Matrix Storage', 'Vector Storage', 'Scalar Storage', 'Tensor Storage'],
        'price_range': (5, 150),
        'descriptions': [
            'Perfect for dorm rooms',
            'Adds personality to your space',
            'Practical and useful',
            'Great condition',
            'Essential item',
            'Multi-purpose use',
            'Space-saving design',
            'Easy to maintain',
            'Durable construction',
            'Versatile functionality',
            'Great for organization',
            'Perfect for students',
            'Affordable quality',
            'Eco-friendly option',
            'Trendy and modern',
            'Classic design',
            'Portable and lightweight',
            'Easy to clean',
            'Long-lasting quality',
            'Great value for money'
        ]
    }
}

# generate realistic listing
def generate_realistic_listing(user, product_type):
    uid, username, email, program, year = user

    # get product-specific data
    product_info = product_data[product_type]
    item = random.choice(product_info['items'])
    min_price, max_price = product_info['price_range']
    price = round(random.uniform(min_price, max_price), 2)

    # trying to add variety to titles
    title = f"{item} - {product_type}"
    if product_type == 'School Supplies':
        title = f"{item} for {program}"

    # generate realistic description
    base_desc = random.choice(product_info['descriptions'])
    condition = random.choice(product_conditions)
    desc = f"{base_desc}. Condition: {condition}. Perfect for university students."

    # variety for quantity (most items should be 1, but some can be multiple)
    quantity = 1 if random.random() > 0.1 else random.randint(2, 5)

    location = random.choice(locations)

    # variety for status distribution (mostly for sale, some pending, few sold)
    status_weights = {'for sale': 0.7, 'pending': 0.2, 'sold': 0.1}
    status = random.choices(list(status_weights.keys()), weights=list(status_weights.values()))[0]

    # mocking image reference
    image_ref = f"images/{product_type.lower().replace(' ', '_')}/{fake.word()}.jpg"

    return (uid, username, product_type, price, title, desc, condition, quantity, location, status, image_ref)

# generate users
users = []
usernames = set()
emails = set()

# add alice as a specific user
alice_uid = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
alice_username = 'alice'
alice_email = 'alice@uwaterloo.ca'
alice_program = 'Computer Science'
alice_year = 3

users.append((alice_uid, alice_username, alice_email, alice_program, alice_year))
usernames.add(alice_username)
emails.add(alice_email)

# generate remaining users
for _ in range(NUM_USERS - 1):  # -1 because alice is already added
    uid = str(uuid.uuid4())

    # Ensure unique username
    while True:
        username = fake.user_name()
        if username not in usernames:
            usernames.add(username)
            break

    # Ensure unique email
    while True:
        email = fake.email()
        if email not in emails:
            emails.add(email)
            break

    program = random.choice(programs)
    year = random.randint(1, 5)
    users.append((uid, username, email, program, year))

# generate admins using ratio-based approach
admin_ids = []
num_admins = NUM_USERS // ADMIN_RATIO  # approx 80 admins for 800 users
for _ in range(num_admins):
    # Keep trying until we get a unique admin
    while True:
        admin = random.choice(users)
        if admin[0] not in admin_ids:
            admin_ids.append(admin[0])
            break

# now generate all the listings
listings = []
# make sure each user has at least one listing for better join results
for user in users:
    num_user_listings = random.randint(1, 3)
    for _ in range(num_user_listings):
        product_type = random.choice(product_types)
        listing = generate_realistic_listing(user, product_type)
        listings.append(listing)

# random listings
while len(listings) < NUM_LISTINGS:
    user = random.choice(users)
    product_type = random.choice(product_types)
    listing = generate_realistic_listing(user, product_type)
    listings.append(listing)

# add alice's specific listings
alice_listings = [
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 299.99, 'MacBook Air 2019 - Electronics', 'Great condition, barely used. Perfect for university students.', 'gently used', 1, 'UWaterloo Campus', 'for sale', 'images/electronics/macbook.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'School Supplies', 45.00, 'Calculus Textbook - School Supplies', 'Used for one term, some highlights. Perfect for university students.', 'gently used', 1, 'UWaterloo Dana Porter Library', 'for sale', 'images/school_supplies/calculus.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Furniture', 120.00, 'Study Desk - Furniture', 'Perfect for student housing. Condition: like new. Perfect for university students.', 'like new', 1, 'Student Housing Complex', 'for sale', 'images/furniture/desk.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Kitchen', 75.00, 'Coffee Maker - Kitchen', 'Still works perfectly, just upgraded. Perfect for university students.', 'gently used', 1, 'Village 1', 'for sale', 'images/kitchen/coffee.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Clothing', 35.00, 'Winter Jacket - Clothing', 'Barely worn. Perfect for university students.', 'like new', 1, 'Downtown Waterloo', 'for sale', 'images/clothing/jacket.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 150.00, 'Wireless Headphones - Electronics', 'Great for studying. Perfect for university students.', 'fair', 1, 'UWaterloo SLC', 'for sale', 'images/electronics/headphones.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'School Supplies', 25.00, 'Notebook Set - School Supplies', 'Complete set with extras. Perfect for university students.', 'new', 1, 'UWaterloo Campus', 'for sale', 'images/school_supplies/notebooks.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Furniture', 80.00, 'Bookshelf - Furniture', 'Space-saving design. Perfect for university students.', 'fair', 1, 'Off-campus housing near University', 'for sale', 'images/furniture/bookshelf.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Kitchen', 45.00, 'Blender - Kitchen', 'Perfect for smoothies. Perfect for university students.', 'gently used', 1, 'Village 2', 'for sale', 'images/kitchen/blender.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Clothing', 20.00, 'T-shirt Bundle - Clothing', '5 t-shirts in good condition. Perfect for university students.', 'fair', 1, 'Waterloo Park', 'for sale', 'images/clothing/tshirts.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 200.00, 'Monitor - Electronics', '24-inch monitor. Perfect for university students.', 'like new', 1, 'Columbia Lake Village', 'for sale', 'images/electronics/monitor.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'School Supplies', 15.00, 'Pen Set - School Supplies', 'Professional quality materials. Perfect for university students.', 'new', 1, 'UWaterloo Student Centre', 'for sale', 'images/school_supplies/pens.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Furniture', 60.00, 'Chair - Furniture', 'Comfortable and ergonomic. Perfect for university students.', 'gently used', 1, 'Student Housing Complex', 'for sale', 'images/furniture/chair.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Kitchen', 30.00, 'Toaster - Kitchen', 'Perfect for small kitchens. Perfect for university students.', 'fair', 1, 'Off-campus housing near Columbia', 'for sale', 'images/kitchen/toaster.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Clothing', 40.00, 'Jeans - Clothing', 'High-quality material. Perfect for university students.', 'like new', 1, 'Downtown Waterloo', 'for sale', 'images/clothing/jeans.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 100.00, 'Webcam - Electronics', 'Great for online classes. Perfect for university students.', 'new', 1, 'UWaterloo Campus', 'for sale', 'images/electronics/webcam.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'School Supplies', 10.00, 'Stapler - School Supplies', 'Essential for your studies. Perfect for university students.', 'new', 1, 'Village 1', 'for sale', 'images/school_supplies/stapler.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Furniture', 90.00, 'Lamp - Furniture', 'Great for studying. Perfect for university students.', 'gently used', 1, 'Waterloo Park', 'for sale', 'images/furniture/lamp.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Kitchen', 50.00, 'Rice Cooker - Kitchen', 'Perfect for meal prep. Perfect for university students.', 'fair', 1, 'UWaterloo SLC', 'for sale', 'images/kitchen/rice_cooker.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Clothing', 25.00, 'Sweater - Clothing', 'Comfortable and warm. Perfect for university students.', 'gently used', 1, 'University Plaza', 'for sale', 'images/clothing/sweater.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 80.00, 'Keyboard - Electronics', 'Mechanical keyboard. Perfect for university students.', 'like new', 1, 'Student Housing Complex', 'for sale', 'images/electronics/keyboard.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'School Supplies', 20.00, 'Binder Set - School Supplies', 'Great for organization. Perfect for university students.', 'new', 1, 'Kitchener Campus', 'for sale', 'images/school_supplies/binders.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Furniture', 70.00, 'Storage Unit - Furniture', 'Multi-functional piece. Perfect for university students.', 'fair', 1, 'Off-campus housing near University', 'for sale', 'images/furniture/storage.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Kitchen', 35.00, 'Mixing Bowls - Kitchen', 'Stainless steel construction. Perfect for university students.', 'new', 1, 'Village 2', 'for sale', 'images/kitchen/bowls.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Clothing', 30.00, 'Dress - Clothing', 'Perfect for formal events. Perfect for university students.', 'like new', 1, 'Downtown Waterloo', 'for sale', 'images/clothing/dress.jpg'),
    ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'Electronics', 120.00, 'Mouse - Electronics', 'Gaming mouse. Perfect for university students.', 'gently used', 1, 'UWaterloo Campus', 'for sale', 'images/electronics/mouse.jpg')
]

# add alice's listings to the main listings array
listings.extend(alice_listings)

# created sql output
def escape(s):
    return s.replace("'", "''")

with open("usell_prod_data.sql", "w") as f:
    # product types (must be inserted first due to foreign key constraints)
    f.write("-- Product Types\n")
    for product_type in product_types:
        f.write(f"INSERT INTO ProductType (type) VALUES ('{product_type}');\n")

    f.write("\n-- Product Conditions\n")
    for condition in product_conditions:
        f.write(f"INSERT INTO ProductCondition (type) VALUES ('{condition}');\n")

    f.write("\n-- Users\n")
    for u in users:
        f.write(f"INSERT INTO Users (uid, username, email, program, year) VALUES ('{u[0]}', '{escape(u[1])}', '{escape(u[2])}', '{escape(u[3])}', {u[4]});\n")

    f.write("\n-- Admins\n")
    for admin_id in admin_ids:
        f.write(f"INSERT INTO Admin (admin_id) VALUES ('{admin_id}');\n")

    f.write("\n-- Listings\n")
    for i, l in enumerate(listings):
        f.write(
            "INSERT INTO Listing (seller_id, type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref) "
            f"VALUES ('{l[0]}', '{l[2]}', {l[3]}, '{escape(l[4])}', '{escape(l[5])}', '{l[6]}', {l[7]}, '{escape(l[8])}', '{escape(l[1])}', '{l[9]}', '{l[10]}');\n"
        )

print(f"SQL file 'usell_prod_data.sql' has been created.")
print(f"Generated {len(users)} users, {len(listings)} listings, and {len(admin_ids)} admins")

(function() {
    angular
        .module("PetShelter")
        .factory("PetShelterConstants", PetShelterConstants);
    function PetShelterConstants() {
        var api = {
            "getAnimals" : getAnimals,
            "getBreeds"  : getBreeds,
            "getSizes"   : getSizes,
            "getSexes"   : getSexes,
            "getAges"    : getAges,
            "getStates"  : getStates
        };
        return api;

        function getAnimals() {
            var animals =  [{
                value: "barnyard",
                display: "Barnyard Animal"
            },{
                value: "bird",
                display: "Bird"
            },{
                value: "cat",
                display: "Cat"
            },{
                value: "dog",
                display: "Dog"
            },{
                value: "horse",
                display: "Horse"
            },{
                value: "pig",
                display: "Pig"
            },{
                value: "reptile",
                display: "Reptile"
            },{
                value: "smallfurry",
                display: "Small Furry Animal"
            }];
            return animals;
        }

        function getBreeds() {
            var breeds = {
                barnyard: [
                    "Alpaca","Alpine","Angus","Barbados","Cow","Goad","Holstein",
                    "Jersey","Llama","Merino","Mouflan","Nigerian Dwarf","Pygmy",
                    "Sheep","Shetland"
                ],
                bird: [
                    "African Grey","Amazon","Brotogeris","Budgie/Budgerigar",
                    "Button Quail","Caique","Canary","Chicken","Cockatiel","Cockatoo",
                    "Conure","Dove","Duck","Eclectus","Emu","Finch","Goose","Guinea Fowl",
                    "Kakariki","Lory/Lorikeet","Lovebird","Macaw","Ostrich","Parakeet (Other)",
                    "Parrot (Other)","Parrotlet","Peacock/Pea fowl","Pheasant","Pigeon",
                    "Pionus","Poicephalus/Senegal","Quail","Quaker Parakeet","Rhea",
                    "Ringneck/Psittacula","Rosella","Swan","Toucan","Turkey"
                ],
                cat: [
                    "Abyssinian","American Curl","American Shorthair","American Wirehair","Applehead Siamese",
                    "Balinese","Bengal","Birman","Bobtail","Bombay","British Shorthair","Burmese","Burmilla",
                    "Calico","Canadian Hairless","Chartreux","Chausie","Chinchilla","Cornish Rex","Cymric","Devon Rex",
                    "Dilute Calico","Dilute Tortoiseshell","Domestic Long Hair","Domestic Long Hair - brown",
                    "Domestic Long Hair - buff","Domestic Long Hair - buff and white","Domestic Long Hair - gray and white",
                    "Domestic Long Hair - orange","Domestic Long Hair - orange and white","Domestic Long Hair-black",
                    "Domestic Long Hair-black and white","Domestic Long Hair-gray","Domestic Long Hair-white",
                    "Domestic Medium Hair","Domestic Medium Hair - brown","Domestic Medium Hair - buff",
                    "Domestic Medium Hair - buff and white","Domestic Medium Hair - gray and white",
                    "Domestic Medium Hair - orange and white","Domestic Medium Hair-black","Domestic Medium Hair-black and white",
                    "Domestic Medium Hair-gray","Domestic Medium Hair-orange","Domestic Medium Hair-white","Domestic Short Hair",
                    "Domestic Short Hair - brown","Domestic Short Hair - buff", "Domestic Short Hair - buff and white",
                    "Domestic Short Hair - gray and white","Domestic Short Hair - orange and white","Domestic Short Hair-black",
                    "Domestic Short Hair-black and white","Domestic Short Hair-gray","Domestic Short Hair-mitted","Domestic Short Hair-orange",
                    "Domestic Short Hair-white","Egyptian Mau","Exotic Shorthair","Extra-Toes Cat (Hemingway Polydactyl)",
                    "Havana","Himalayan","Japanese Bobtail","Javanese","Korat","LaPerm","Maine Coon","Manx","Munchkin",
                    "Nebelung","Norwegian Forest Cat","Ocicat","Oriental Long Hair","Oriental Short Hair","Oriental Tabby",
                    "Persian","Pixie-Bob","Ragamuffin","Ragdoll","Russian Blue","Scottish Fold","Selkirk Rex","Siamese","Siberian",
                    "Silver","Singapura","Snowshoe","Somali","Sphynx (hairless cat)","Tabby","Tabby - black","Tabby - Brown","Tabby - buff",
                    "Tabby - Grey","Tabby - Orange","Tabby - white","Tiger","Tonkinese","Torbie","Tortoiseshell","Turkish Angora","Turkish Van","Tuxedo"
                ],
                dog: [
                    "Affenpinscher","Afghan Hound","Airedale Terrier","Akbash","Akita","Alaskan Malamute",
                    "American Bulldog","American Eskimo Dog","American Hairless Terrier","American Staffordshire Terrier",
                    "American Water Spaniel","Anatolian Shepherd","Appenzell Mountain Dog","Australian Cattle Dog (Blue Heeler)",
                    "Australian Kelpie","Australian Shepherd","Australian Terrier","Basenji","Basset Hound","Beagle",
                    "Bearded Collie","Beauceron","Bedlington Terrier","Belgian Shepherd Dog Sheepdog","Belgian Shepherd Laekenois",
                    "Belgian Shepherd Malinois","Belgian Shepherd Tervuren","Bernese Mountain Dog","Bichon Frise",
                    "Black and Tan Coonhound","Black Labrador Retriever","Black Mouth Cur","Black Russian Terrier","Bloodhound",
                    "Blue Lacy","Bluetick Coonhound","Boerboel","Bolognese","Border Collie","Border Terrier","Borzoi",
                    "Boston Terrier","Bouvier des Flanders","Boxer","Boykin Spaniel","Briard","Brittany Spaniel",
                    "Brussels Griffon","Bull Terrier","Bullmastiff","Cairn Terrier","Canaan Dog","Cane Corso Mastiff",
                    "Carolina Dog","Catahoula Leopard Dog","Cattle Dog","Caucasian Sheepdog (Caucasian Ovtcharka)",
                    "Cavalier King Charles Spaniel","Chesapeake Bay Retriever","Chihuahua","Chinese Crested Dog",
                    "Chinese Foo Dog","Chinook","Chocolate Labrador Retriever","Chow Chow","Cirneco dell'Etna","Clumber Spaniel",
                    "Cockapoo","Cocker Spaniel","Collie","Coonhound","Corgi","Coton de Tulear","Curly-Coated Retriever",
                    "Dachshund","Dalmatian","Dandi Dinmont Terrier","Doberman Pinscher","Dogo Argentino","Dogue de Bordeaux",
                    "Dutch Shepherd","English Bulldog","English Cocker Spaniel","English Coonhound","English Pointer",
                    "English Setter","English Shepherd","English Springer Spaniel","English Toy Spaniel","Entlebucher",
                    "Eskimo Dog","Feist","Field Spaniel","Fila Brasileiro","Finnish Lapphund","Finnish Spitz",
                    "Flat-coated Retriever","Fox Terrier","Foxhound","French Bulldog","Galgo Spanish Greyhound",
                    "German Pinscher","German Shepherd Dog","German Shorthaired Pointer","German Spitz","German Wirehaired Pointer",
                    "Giant Schnauzer","Glen of Imaal Terrier","Golden Retriever","Gordon Setter","Great Dane","Great Pyrenees",
                    "Greater Swiss Mountain Dog","Greyhound","Harrier","Havanese","Hound","Hovawart","Husky",
                    "Ibizan Hound","Icelandic Sheepdog","Illyrian Sheepdog","Irish Setter","Irish Terrier","Irish Water Spaniel",
                    "Irish Wolfhound","Italian Greyhound","Italian Spinone","Jack Russell Terrier",
                    "Jack Russell Terrier (Parson Russell Terrier)","Japanese Chin","Jindo","Kai Dog","Karelian Bear Dog",
                    "Keeshond","Kerry Blue Terrier","Kishu","Klee Kai","Komondor","Kuvasz","Kyi Leo","Labrador Retriever",
                    "Lakeland Terrier","Lancashire Heeler","Leonberger","Lhasa Apso","Lowchen","Maltese","Manchester Terrier",
                    "Maremma Sheepdog","Mastiff","McNab","Miniature Pinscher","Mountain Cur","Mountain Dog","Munsterlander",
                    "Neapolitan Mastiff","New Guinea Singing Dog","Newfoundland Dog","Norfolk Terrier","Norwegian Buhund",
                    "Norwegian Elkhound","Norwegian Lundehund","Norwich Terrier","Nova Scotia Duck-Tolling Retriever",
                    "Old English Sheepdog","Otterhound","Papillon","Patterdale Terrier (Fell Terrier)","Pekingese",
                    "Peruvian Inca Orchid","Petit Basset Griffon Vendeen","Pharaoh Hound","Pit Bull Terrier","Plott Hound",
                    "Podengo Portugueso","Pointer","Polish Lowland Sheepdog","Pomeranian","Poodle","Portuguese Water Dog",
                    "Presa Canario","Pug","Puli","Pumi","Rat Terrier","Redbone Coonhound","Retriever","Rhodesian Ridgeback",
                    "Rottweiler","Saint Bernard St. Bernard","Saluki","Samoyed","Sarplaninac","Schipperke","Schnauzer",
                    "Scottish Deerhound","Scottish Terrier Scottie","Sealyham Terrier","Setter","Shar Pei","Sheep Dog",
                    "Shepherd","Shetland Sheepdog Sheltie","Shiba Inu","Shih Tzu","Siberian Husky","Silky Terrier",
                    "Skye Terrier","Sloughi","Smooth Fox Terrier","South Russian Ovtcharka","Spaniel","Spitz",
                    "Staffordshire Bull Terrier","Standard Poodle","Sussex Spaniel","Swedish Vallhund","Terrier",
                    "Thai Ridgeback","Tibetan Mastiff","Tibetan Spaniel","Tibetan Terrier","Tosa Inu","Toy Fox Terrier",
                    "Treeing Walker Coonhound","Vizsla","Weimaraner","Welsh Corgi","Welsh Springer Spaniel","Welsh Terrier",
                    "West Highland White Terrier Westie","Wheaten Terrier","Whippet","White German Shepherd","Wire Fox Terrier",
                    "Wire-haired Pointing Griffon","Wirehaired Terrier","Xoloitzcuintle (Mexican Hairless)",
                    "Yellow Labrador Retriever","Yorkshire Terrier Yorkie"
                ],
                horse: [
                    "Appaloosa","Arabian","Belgian","Clydesdale","Curly Horse","Donkey","Draft","Gaited","Grade",
                    "Lipizzan","Miniature Horse","Missouri Foxtrotter","Morgan","Mule","Mustang","Paint/Pinto",
                    "Palomino","Paso Fino","Percheron","Peruvian Paso","Pony","Quarterhorse","Saddlebred","Shetland Pony",
                    "Standardbred","Tennessee Walker","Thoroughbred","Warmblood"
                ],
                pig: [
                    "Pig (Farm)","Pot Bellied","Vietnamese Pot Bellied"
                ],
                reptile: [
                    "Asian Box","Ball Python","Bearded Dragon","Boa","Boa Constrictor","Box","Bull","Bull Frog","Burmese Python",
                    "Chameleon","Corn/Rat","Eastern Box","Fire Salamander","Fire-bellied","Fire-bellied Newt","Florida Box",
                    "Freshwater Fish","Frog","Garter/Ribbon","Gecko","Goldfish","Hermit Crab","Horned Frog","Iguana",
                    "King/Milk","Leopard","Leopard Frog","Lizard","Monitor","Mud","Musk","Oregon Newt","Ornamental Box",
                    "Paddle Tailed Newt","Painted","Python","Red Foot","Red-eared Slider","Russian","Saltwater Fish",
                    "Scorpion","Snake","Snapping","Soft Shell","Southern","Sulcata","Tarantula","Three Toed Box","Tiger Salamander",
                    "Toad","Tortoise","Tree Frog","Turtle","Uromastyx","Yellow-bellied Slider"
                ],
                smallfurry: [
                    "Abyssinian","Chinchilla","Degu","Ferret","Gerbil","Guinea Pig","Hamster","Hedgehog","Mouse",
                    "Peruvian","Prairie Dog","Rat","Rex","Short-haired","Silkie/Sheltie","Skunk","Sugar Glider","Teddy"
                ]
            };
            return breeds;
        }

        function getSizes() {
            var sizes = [{
                value: "S",
                display: "Small"
            },{
                value: "M",
                display: "Medium"
            },{
                value: "L",
                display: "Large"
            },{
                value: "XL",
                display: "Extra-Large"
            }];
            return sizes;
        }

        function getSexes() {
            var sexes = [{
                value: "M",
                display: "Male"
            },{
                value: "F",
                display: "Female"
            }];
            return sexes;
        }

        function getAges() {
            var ages = [
                "Baby", "Young", "Adult", "Senior"
            ];
            return ages;
        }

        function getStates() {
            return ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL",
                "GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA",
                "MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE",
                "NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW",
                "RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI",
                "WV","WY"];
        }
    }
})();
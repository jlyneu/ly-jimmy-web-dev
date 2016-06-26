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
            "getAges"    : getAges
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
                    "Alpaca","Alpine","Angus","Barbados","Cow"
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
                    "Abyssinian","American Curl","American Shorthair","American Wirehair","Applehead Siamese"
                ],
                dog: [
                    "Affenpinscher","Afghan Hound","Airedale Terrier","Akbash","Akita"
                ],
                horse: [
                    "Appaloosa","Arabian","Belgian","Clydesdale","Curly Horse"
                ],
                pig: [
                    "Pig (Farm)","Pot Bellied","Vietnamese Pot Bellied"
                ],
                reptile: [
                    "Asian Box","Ball Python","Bearded Dragon","Boa","Boa Constrictor"
                ],
                smallfurry: [
                    "Abyssinian","Chinchilla","Degu","Ferret","Gerbil"
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
    }
})();
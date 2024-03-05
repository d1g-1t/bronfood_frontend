import { createContext, FC, useState, PropsWithChildren, useMemo, useEffect } from 'react';
import { mockRestaurants } from '../pages/Restaurants/MockRestaurantsList';

export type Meal = {
    id: string;
    name: string;
    photo: string;
    price: number;
    type: 'food' | 'drink' | 'dessert';
};

export type Restaurant = {
    id: string;
    photo: string;
    name: string;
    rating: number;
    address: string;
    workingTime: string;
    meals: Meal[];
    type: 'fastFood' | 'cafe' | 'cafeBar';
};

export type Option = {
    id: number;
    name: string;
};

export type VenueType = {
    id: number;
    name: string;
    selected: boolean;
};

type RestaurantsContext = {
    restaurantsOnMap: Restaurant[] | [];
    restaurantsFiltered: Restaurant[] | [];
    drawer: {
        isOpen: boolean;
        toggle: () => void;
    };
    filter: {
        isOpen: boolean;
        open: () => void;
        close: () => void;
    };
    restaurant: {
        isOpen: boolean;
        open: () => void;
        close: () => void;
    };
    options: {
        all: Option[];
        selectedOptions: Option[];
        addOption: (option: Option) => void;
        deleteOption: (option: Option) => void;
    };
    venueTypes: {
        types: VenueType[];
        toggleType: (type: string) => void;
    };
};

export const RestaurantsContext = createContext<RestaurantsContext>({
    restaurantsOnMap: [],
    restaurantsFiltered: [],
    drawer: {
        isOpen: true,
        toggle: () => {},
    },
    filter: {
        isOpen: false,
        open: () => {},
        close: () => {},
    },
    restaurant: {
        isOpen: false,
        open: () => {},
        close: () => {},
    },
    options: {
        all: [],
        selectedOptions: [],
        addOption: () => {},
        deleteOption: () => {},
    },
    venueTypes: {
        types: [],
        toggleType: () => {},
    },
});

export const RestaurantsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [restaurantsOnMap, setRestaurantsOnMap] = useState<Restaurant[]>([]);
    const [restaurantsFiltered, setRestaurantsFiltered] = useState<Restaurant[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isRestaurantOpen, setIsRestaurentOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);
    const openRestaurant = () => setIsRestaurentOpen(true);
    const closeRestaurant = () => setIsRestaurentOpen(false);
    const options = useMemo(() => {
        let id = 1;
        const array: Array<Option> = [];
        restaurantsOnMap.forEach(async (restaurant: Restaurant) => {
            await restaurant.meals.forEach((meal) => {
                array.push({ id: id++, name: meal.name });
            });
            array.push({ id: id++, name: restaurant.name });
        });
        return array;
    }, [restaurantsOnMap]);
    const types = useMemo(() => {
        let id = 1;
        const array: Array<string> = [];
        restaurantsOnMap.forEach((restaurant: Restaurant) => array.push(restaurant.type));
        const uniqueTypes = array.filter((type, i, ar) => ar.indexOf(type) === i);
        return uniqueTypes.map((type) => {
            return { id: id++, name: type, selected: false };
        });
    }, [restaurantsOnMap]);
    const addOption = (option: Option) => {
        const isDouble = selectedOptions.find((opt: Option) => opt.id === option.id);
        if (isDouble) {
            return;
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    const deleteOption = (option: Option) => {
        setSelectedOptions(selectedOptions.filter((opt: Option) => opt.id !== option.id));
    };
    const toggleType = (venue: VenueType) => {
        setVenueTypes((venueTypes) =>
            venueTypes.map((type) => {
                if (type.id === venue.id) {
                    return { ...type, selected: !type.selected };
                } else return type;
            }),
        );
    };
    useEffect(() => {
        const isTypeSelected = venueTypes.some((type) => type.selected);
        if (restaurantsOnMap.length === 0) {
            return;
        } else if (selectedOptions.length === 0 && !isTypeSelected) {
            setRestaurantsFiltered(restaurantsOnMap);
        } else {
            const optionNames = selectedOptions.map((option) => option.name.toLowerCase());
            const typeNames = venueTypes.map((type) => (type.selected ? type.name.toLowerCase() : null));
            const filtered = restaurantsOnMap.filter((restaurant) => {
                const isMealFound = restaurant.meals.some((meal) => optionNames.includes(meal.name.toLowerCase()));
                const isRestaurantFound = optionNames.includes(restaurant.name.toLowerCase());
                const isTypeFound = typeNames.includes(restaurant.type.toLowerCase());
                if (isMealFound || isRestaurantFound || isTypeFound) {
                    return restaurant;
                } else {
                    return;
                }
            });
            setRestaurantsFiltered(filtered);
        }
    }, [restaurantsOnMap, selectedOptions, venueTypes]);
    useEffect(() => {
        setRestaurantsOnMap(mockRestaurants);
        setRestaurantsFiltered(mockRestaurants);
    }, []);
    useEffect(() => {
        setVenueTypes(types);
    }, [types]);
    return (
        <RestaurantsContext.Provider
            value={{
                restaurantsOnMap,
                restaurantsFiltered,
                drawer: {
                    isOpen: isDrawerOpen,
                    toggle: toggleDrawer,
                },
                filter: {
                    isOpen: isFilterOpen,
                    open: openFilter,
                    close: closeFilter,
                },
                restaurant: {
                    isOpen: isRestaurantOpen,
                    open: openRestaurant,
                    close: closeRestaurant,
                },
                options: {
                    all: options,
                    selectedOptions,
                    addOption,
                    deleteOption,
                },
                venueTypes: {
                    types: venueTypes,
                    toggleType,
                },
            }}
        >
            {children}
        </RestaurantsContext.Provider>
    );
};

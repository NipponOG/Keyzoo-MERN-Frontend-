import { useEffect, useState } from 'react';

export default function useRecentlyViewed() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem('recently_viewed');
        if (data) {
            setItems(JSON.parse(data));
        }
    }, []);

    return items;
}

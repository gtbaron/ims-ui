import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PartsListPage from "./components/parts/PartsListPage";
import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react";
import {HiClipboardList, HiShoppingBag} from "react-icons/hi";
import {HiWrench} from "react-icons/hi2";
import {IoStorefront} from "react-icons/io5";
import {ItemListPage} from "@/components/items/ItemListPage";
import {ItemDetailsPage} from "@/components/items/ItemDetailsPage";
import {ListingsPage} from "@/components/listings/ListingsPage";
import {useAppDispatch} from "@/store/hooks";
import {useEffect} from "react";
import {fetchItems} from "@/store/slices/ItemsSlice";
import {fetchParts} from "@/store/slices/PartsSlice";
import {PickListsPage} from "@/components/pickLists/PickListsPage";
import {fetchPickLists} from "@/store/slices/PickListSlice";

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchItems());
        dispatch(fetchParts());
        dispatch(fetchPickLists());
    }, [dispatch]);

    return (
        <main className={'max-h-screen'}>
            <Router>
                <div id={'main'}>
                    <div id={'left'}>
                        <Sidebar>
                            <SidebarItems>
                                <SidebarItemGroup>
                                    <SidebarItem href='/listings' icon={IoStorefront}>
                                        Listings
                                    </SidebarItem>
                                    <SidebarItem href="/items" icon={HiShoppingBag}>
                                        Items
                                    </SidebarItem>
                                    <SidebarItem href="/parts" icon={HiWrench}>
                                        Parts
                                    </SidebarItem>
                                    <SidebarItem href='/pick-lists' icon={HiClipboardList}>
                                        Pick Lists
                                    </SidebarItem>
                                </SidebarItemGroup>
                            </SidebarItems>
                        </Sidebar>
                    </div>
                    <div id={'right'}>
                        <Routes>
                            <Route path="/parts" element={<PartsListPage />} />
                            <Route path="/items" element={<ItemListPage />} />
                            <Route path="/item-details" element={<ItemDetailsPage />} />
                            <Route path='/pick-lists' element={<PickListsPage />} />
                            <Route path='/listings' element={<ListingsPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </main>
    )
}

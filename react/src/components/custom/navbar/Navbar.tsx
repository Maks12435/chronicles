import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '../../ui/navigation-menu'
import { Link } from '@tanstack/react-router'
import { navigationMenuTriggerStyle } from '../../ui/navigation-menu'

export default function Navbar() {
    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/profile">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/diary">Diary</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/tasks">Tasks</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="chronics">Interests</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    )
}

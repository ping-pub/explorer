// 👉 Vertical nav section title
export interface NavSectionTitle extends Partial<AclProperties> {
    heading: string
}

// 👉 Vertical nav link
declare type ATagTargetAttrValues = '_blank' | '_self' | '_parent' | '_top' | 'framename'
declare type ATagRelAttrValues =
    | 'alternate'
    | 'author'
    | 'bookmark'
    | 'external'
    | 'help'
    | 'license'
    | 'next'
    | 'nofollow'
    | 'noopener'
    | 'noreferrer'
    | 'prev'
    | 'search'
    | 'tag'

export interface NavLinkProps {
    to?: RouteLocationRaw | string | null
    href?: string
    target?: ATagTargetAttrValues
    rel?: ATagRelAttrValues
    i18n?: boolean
}

export interface Icon {
    icon?: string,
    image?: string,
    size: string,
}

export interface NavLink extends NavLinkProps {
    title: string
    icon?: Icon
    badgeContent?: string
    badgeClass?: string
    disable?: boolean
    order?: number
}

// 👉 Vertical nav group
export interface NavGroup extends NavLinkProps {
    title: string
    icon?: Icon
    badgeContent?: string
    badgeClass?: string
    children: (NavLink | NavGroup)[]
    disable?: boolean
    order?: number
}

export declare type VerticalNavItems = (NavLink | NavGroup | NavSectionTitle)[]
export declare type HorizontalNavItems = (NavLink | NavGroup)[]
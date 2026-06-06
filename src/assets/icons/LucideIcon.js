import * as LucideIcons from "lucide-react";
import React from "react";

export default function LucideIcon({ name, size = 24, color = "#6b7280", onClick }) {
    if (!name) return null;

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const IconComponent = LucideIcons[formattedName];

    if (!IconComponent) return null;

    return <IconComponent onClick={onClick} size={size} color={color} />;
}
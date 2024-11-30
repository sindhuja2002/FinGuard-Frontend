import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, Car, Home, Utensils, Coffee,
  Film, Book, Gift, Heart, Music,
  Plane, Gamepad, Shirt, Dumbbell, Stethoscope,
  LucideIcon
} from 'lucide-react'

const ICONS: { [key: string]: LucideIcon } = {
  'shopping-bag': ShoppingBag,
  'car': Car,
  'home': Home,
  'utensils': Utensils,
  'coffee': Coffee,
  'film': Film,
  'book': Book,
  'gift': Gift,
  'heart': Heart,
  'music': Music,
  'plane': Plane,
  'gamepad': Gamepad,
  'shirt': Shirt,
  'dumbbell': Dumbbell,
  'medical': Stethoscope,
}

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
  color: string
}

export function IconSelector({ value, onChange, color }: IconSelectorProps) {
  const SelectedIcon = ICONS[value] || ShoppingBag

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[4rem] h-[2.5rem]">
          <SelectedIcon color={color} size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[15rem] p-2">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(ICONS).map(([name, Icon]) => (
            <Button
              key={name}
              variant="ghost"
              className="h-10 w-10 p-0"
              onClick={() => onChange(name)}
            >
              <Icon color={color} size={20} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
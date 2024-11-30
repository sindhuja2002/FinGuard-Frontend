'use client'

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/lib/services/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';


export function WishlistSettings() {
  const [wishlist, setWishlist] = useState<{ [key: string]: number }>({});
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number | ''>('');
    const { toast } = useToast();
    const form = useForm();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await userService.getWishlist();
        setWishlist(data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddItem = async () => {
    if (!itemName || !itemPrice) {
      toast({
        title: 'Error',
        description: 'Please enter both item name and price',
        variant: 'destructive',
      });
      return;
    }

    try {
      await userService.addWishlistItem(itemName, Number(itemPrice));
      setWishlist((prev) => ({ ...prev, [itemName]: Number(itemPrice) }));
      setItemName('');
      setItemPrice('');
      toast({
        title: 'Success',
        description: `Added ${itemName} to wishlist`,
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({
        title: 'Error',
        description: 'Could not add item to wishlist',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (name: string) => {
    try {
      await userService.removeWishlistItem(name);
      setWishlist((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      toast({
        title: 'Success',
        description: `Removed ${name} from wishlist`,
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        title: 'Error',
        description: `Could not remove ${name} from wishlist`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="itemName"
                render={() => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Item Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="itemPrice"
                render={() => (
                  <FormItem>
                    <FormLabel>Item Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Item Price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </Form>
        <ul className="mt-4 space-y-2">
          {Object.entries(wishlist).map(([name, price]) => (
            <li key={name} className="flex justify-between items-center">
              <span>{name}: ${price.toFixed(2)}</span>
              <Button variant="destructive" onClick={() => handleRemoveItem(name)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
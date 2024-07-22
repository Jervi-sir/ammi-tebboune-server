import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from '@/Components/ui/input';

interface LocationSelectProps {
  location: string;
  setLocation: (value: string) => void;
  wilaya: string;
  setWilaya: (value: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ location, setLocation, wilaya, setWilaya }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <Input
        type="text"
        placeholder="Location (optional)"
        className="flex-1"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex w-full md:w-[unset]">
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger>
            <SelectValue placeholder="Wilaya (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelect;

declare module "react-date-range" {
    import * as React from "react";
  
    export interface Range {
      startDate: Date;
      endDate: Date;
      key: string;
    }
  
    export interface DateRangeProps {
      ranges: Range[];
      onChange: (ranges: { [key: string]: Range }) => void;
      editableDateInputs?: boolean;
      moveRangeOnFirstSelection?: boolean;
      minDate?: Date;
      isDateBlocked?: (date: Date) => boolean;
      rangeColors?: string[];
    }
  
    const DateRange: React.FC<DateRangeProps>;
  
    export default DateRange;
  }
  
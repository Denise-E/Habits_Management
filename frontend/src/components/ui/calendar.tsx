import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// Custom Spanish locale configuration
const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const esCustomLocale = {
  localize: {
    day: n => days[n],  // Días de la semana en formato corto
    month: n => months[n] // Meses completos en español
  },
  formatLong: {
    date: () => 'dd/MM/yyyy' // Formato de fecha más común en español
  }
};

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  onAccept?: () => void;
  onCancel?: () => void;
};

function Calendar({
  className,
  showOutsideDays = true,
  selected,
  onSelect,
  onAccept,
  onCancel,
  ...props
}: CalendarProps) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-background text-foreground">
      <DayPicker
        mode="single"
        captionLayout="dropdown"
        selected={selected}
        onSelect={onSelect}
        locale={esCustomLocale}
        showOutsideDays={showOutsideDays}
        className={className}
        {...props}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-md hover:bg-muted/60 transition"
          onClick={onCancel}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          onClick={onAccept}
          type="button"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export { Calendar };
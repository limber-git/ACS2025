/**
 * Determina si un registro representa una llegada tarde.
 * @param scheduledIn Hora de entrada esperada en minutos (desde 00:00)
 * @param actualIn Hora de entrada real en minutos (desde 00:00)
 * @param toleranceMin Tolerancia en minutos
 * @returns true si está retrasado
 */
export function isLate(scheduledIn: number, actualIn: number, toleranceMin = 5): boolean {
    return actualIn > (scheduledIn + toleranceMin);
  }
  
  /**
   * Determina si un registro representa una salida temprana.
   * @param scheduledOut Hora de salida esperada en minutos (desde 00:00)
   * @param actualOut Hora de salida real en minutos (desde 00:00)
   * @param toleranceMin Tolerancia en minutos
   * @returns true si salió temprano
   */
  export function isLeftEarly(scheduledOut: number, actualOut: number, toleranceMin = 5): boolean {
    return actualOut < (scheduledOut - toleranceMin);
  }
  
  /**
   * Convierte un string hora tipo 'HH:MM' a minutos desde 00:00.
   * @param timeString Hora como string, ej '14:30'
   * @returns minutos totales
   */
  export function timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  /**
   * Convierte minutos desde 00:00 a string 'HH:MM'.
   * @param totalMinutes Minutos totales
   * @returns String hora
   */
  export function minutesToTimeString(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
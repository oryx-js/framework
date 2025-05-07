/**
 * packages
 */
import Common from '@core/common';

export default class CoreDate extends Date {
    private static defaultTimezone: string = Common.env<string>(
        'APP_TIMEZONE',
        'UTC',
    );
    private static locale: string =
        Intl.DateTimeFormat().resolvedOptions().locale;

    private date: Date;

    private constructor(date?: Date | string | number) {
        super();
        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date format');
            }
            this.date = parsedDate;
        } else {
            this.date = new Date();
        }
    }

    public static setTimezone(timezone: string): void {
        this.defaultTimezone = timezone;
    }

    public static create(date?: Date | string | number): CoreDate {
        return new CoreDate(date);
    }

    public toString(format: Intl.DateTimeFormatOptions = {}): string {
        return this.date.toLocaleString(CoreDate.locale, {
            timeZone: CoreDate.defaultTimezone,
            ...format,
        });
    }

    public format(fmt: string = 'Y-m-d H:i:s'): string {
        const pad = (n: number, len = 2) => String(n).padStart(len, '0');
        const date = this.date;

        const replacements: { [key: string]: string | number } = {
            Y: date.getFullYear(),
            y: String(date.getFullYear()).slice(-2),
            m: pad(date.getMonth() + 1),
            n: date.getMonth() + 1,
            d: pad(date.getDate()),
            j: date.getDate(),
            H: pad(date.getHours()),
            G: date.getHours(),
            h: pad(date.getHours() % 12 || 12),
            g: date.getHours() % 12 || 12,
            i: pad(date.getMinutes()),
            s: pad(date.getSeconds()),
            A: date.getHours() < 12 ? 'AM' : 'PM',
            a: date.getHours() < 12 ? 'am' : 'pm',
            D: date.toLocaleString(CoreDate.locale, { weekday: 'short' }),
            l: date.toLocaleString(CoreDate.locale, { weekday: 'long' }),
            M: date.toLocaleString(CoreDate.locale, { month: 'short' }),
            F: date.toLocaleString(CoreDate.locale, { month: 'long' }),
            U: Math.floor(date.getTime() / 1000),
        };

        return fmt.replace(/[YymndjHhGgisAaDlMFU]/g, (match) =>
            String(replacements[match] ?? match),
        );
    }

    public add(
        amount: number,
        unit:
            | 'days'
            | 'hours'
            | 'minutes'
            | 'seconds'
            | 'weeks'
            | 'months'
            | 'years',
    ): this {
        if (unit === 'days') {
            this.date.setDate(this.date.getDate() + amount);
        } else if (unit === 'hours') {
            this.date.setHours(this.date.getHours() + amount);
        } else if (unit === 'minutes') {
            this.date.setMinutes(this.date.getMinutes() + amount);
        } else if (unit === 'seconds') {
            this.date.setSeconds(this.date.getSeconds() + amount);
        } else if (unit === 'weeks') {
            this.date.setDate(this.date.getDate() + amount * 7);
        } else if (unit === 'months') {
            const currentMonth = this.date.getMonth();
            this.date.setMonth(currentMonth + amount);
            if (this.date.getMonth() !== (currentMonth + amount) % 12) {
                this.date.setDate(0);
            }
        } else if (unit === 'years') {
            this.date.setFullYear(this.date.getFullYear() + amount);
        }
        return this;
    }

    public subtract(
        amount: number,
        unit:
            | 'days'
            | 'hours'
            | 'minutes'
            | 'seconds'
            | 'weeks'
            | 'months'
            | 'years',
    ): this {
        return this.add(-amount, unit);
    }

    public toUnix(): number {
        return Math.floor(this.date.getTime() / 1000);
    }

    public isValid(): boolean {
        return !isNaN(this.date.getTime());
    }

    public isLeapYear(): boolean {
        const year = this.date.getFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    public toISO(): string {
        return this.date.toISOString();
    }

    public toUTC(): string {
        return this.date.toUTCString();
    }

    public toTimezone(timezone: string): string {
        return this.date.toLocaleString(CoreDate.locale, {
            timeZone: timezone,
        });
    }

    public isDateExceed(limit: Date): boolean {
        return this.date.getTime() > limit.getTime();
    }

    public diff(
        date: CoreDate,
        unit:
            | 'days'
            | 'hours'
            | 'minutes'
            | 'seconds'
            | 'weeks'
            | 'months'
            | 'years',
    ): number {
        const diffMs = this.date.getTime() - date.date.getTime();

        const conversions = {
            days: 86400000,
            hours: 3600000,
            minutes: 60000,
            seconds: 1000,
            weeks: 86400000 * 7,
            months: 86400000 * 30,
            years: 86400000 * 365,
        };

        return Math.floor(diffMs / conversions[unit]);
    }

    public isBefore(date: CoreDate): boolean {
        return this.date.getTime() < date.date.getTime();
    }

    public isAfter(date: CoreDate): boolean {
        return this.date.getTime() > date.date.getTime();
    }

    public isSame(date: CoreDate): boolean {
        return this.date.getTime() === date.date.getTime();
    }

    public toRelative(): string {
        const now = new Date();
        const diffMs = now.getTime() - this.date.getTime();
        const seconds = Math.floor(diffMs / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} days ago`;

        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} weeks ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;

        const years = Math.floor(days / 365);
        if (years < 1) return `${months} months ago`;

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const month = monthNames[this.date.getMonth()];
        const day = this.date.getDate();
        const year = this.date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    public toDate(): Date {
        return new Date(this.date.getTime());
    }

    public static isPast(date: string | Date): boolean {
        return new Date(date) < new Date();
    }
}

export interface CreateOrder {
  description: string;
  invoice_url?: string;
  label: string;
  status: Status;
  priority: Priority;
  volume?: number;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  price?: number;

  // todo: need to add
  from: City;
  to: City;
  delivery_type: DeliveryType;
  payer: Payer;
  recipient: Recipient;
  sender: Sender;
  insurance_cost: number;
  number_of_packages: number;
  value_of_goods: number;
}

export interface Order extends CreateOrder {
    id: string;
    code: string
    created_at: Date;
    updated_at: Date;
}

export interface City {
  id: string;
  name: string;
}

export enum DeliveryType {
  DOOR_TO_TERMINAL = 'door_to_terminal',
  DOOR_TO_DOOR = 'door_to_door',
}

export enum Status {
  CREATED = 'created',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Sender {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
}

export interface Payer extends Sender {
  bin: string;
  abte_id: string;
}

export interface Recipient extends Sender {
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export const state_with_colors = [
  {text: 'new', color: 'status-new'},
  {text: 'pending', color: 'status-pending'},
  {text: 'approved', color: 'status-approved'},
  {text: 'held', color: 'status-held'},
  {text: 'rejected', color: 'status-rejected'},
  {text: 'cancelled', color: 'status-cancelled'},
  {text: 'intervention', color: 'status-intervention'},
  {text: 'clinicalCheck', color: 'status-clinicalcheck'},
  {text: 'dispatched', color: 'status-dispatched'},
  {text: 'fulfilled', color: 'status-fulfilled'},
  {text: 'paymentPending', color: 'payment-pending'},
  {text: 'shipped', color: 'status-shipped'},
]

export const months = [
  {name: 'January', value: 'January'},
  {name: 'February', value: 'February'},
  {name: 'March', value: 'March'},
  {name: 'April', value: 'April'},
  {name: 'May', value: 'May'},
  {name: 'June', value: 'June'},
  {name: 'July', value: 'July'},
  {name: 'August', value: 'August'},
  {name: 'September', value: 'September'},
  {name: 'October', value: 'October'},
  {name: 'November', value: 'November'},
  {name: 'December', value: 'December'},
]

export const order_state_list = [
  { name: 'Clinical Check', value: 'clinicalCheck' },
  { name: 'Intervention', value: 'intervention' },
  { name: 'Approved', value: 'approved' },
  { name: 'Cancelled', value: 'cancelled' },
  { name: 'Rejected', value: 'rejected' },
  { name: 'Order Processing', value: 'orderProcessing' },
  { name: 'Shipped', value: 'shipped' }
]

export const primed_state_list = [
  { name: 'Order Processing', value: 'orderProcessing' },
  { name: 'Shipment Pending', value: 'pending' },
  { name: 'Shipped', value: 'shipped' },
  { name: 'Cancelled', value: 'cancelled' },
]

export const payment_type_list = [
  { name: '1 month', value: '1 month' },
  { name: '3 month', value: '3 month' }
]

export const clinic_list = [
  { name: 'Harley Pharmacy', value: '1' },
]

export const is_active = [
  { id: 1, name: 'Active', value: true },
  { id: 2, name: 'Inactive', value: false },
]

export const is_stock_available = [
  { id: 1, name: 'In-stock', value: true },
  { id: 2, name: 'Out-of-stock', value: false },
]

export const transport_type = [
  { id: 1, name: 'In-Cold chain', value: true },
  { id: 2, name: 'Non–cold chain', value: false },
]

export const dosage_units = [
  { id: 1, name: 'mg', value: 'mg' },
  { id: 2, name: 'g', value: 'g' },
  { id: 3, name: 'ml', value: 'ml' },
  { id: 4, name: 'l', value: 'l' },
]

export const payment_type = [
  { id: 1, name: 'Credit', value: 'credit' },
  { id: 2, name: 'Cash', value: 'cash' },
  { id: 3, name: 'Insurance', value: 'insurance' },
]

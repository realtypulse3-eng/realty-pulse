import * as XLSX from 'xlsx';
import { Property, Lead, Deal, Appointment, DashboardMetrics } from '../types';

export const generatePropertiesExcel = (properties: Property[]) => {
  const formattedData = properties.map(p => ({
    'ID': p.id,
    'Title': p.title,
    'Property Type': p.property_type,
    'Status': p.status,
    'Price (USD)': p.price,
    'Bedrooms': p.bedrooms,
    'Bathrooms': p.bathrooms,
    'Area (Sq Ft)': p.area,
    'Address': p.address,
    'City': p.city,
    'State': p.state,
    'Amenities': p.amenities.join(', '),
    'Listing Date': new Date(p.listing_date).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Active Properties');

  XLSX.writeFile(workbook, `RealtyPulse_Properties_${Date.now()}.xlsx`);
};

export const generateLeadsExcel = (leads: Lead[]) => {
  const formattedData = leads.map(l => ({
    'Lead ID': l.id,
    'Name': l.name,
    'Email': l.email,
    'Phone': l.phone,
    'Budget Min ($)': l.budget_min,
    'Budget Max ($)': l.budget_max,
    'Preferred Location': l.preferred_location,
    'Property Type': l.preferred_property_type,
    'Status': l.status,
    'Qualification Score': l.qualification_score || 0,
    'Source': l.source,
    'Created At': new Date(l.created_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CRM Leads');

  XLSX.writeFile(workbook, `RealtyPulse_Leads_${Date.now()}.xlsx`);
};

export const generateDealsExcel = (deals: Deal[]) => {
  const formattedData = deals.map(d => ({
    'Deal ID': d.id,
    'Property Title': d.property_title || d.property_id,
    'Client Name': d.client_name || d.client_id,
    'Deal Value ($)': d.deal_value,
    'Commission ($)': d.commission,
    'Status': d.status,
    'Payment Status': d.payment_status,
    'Closing Date': d.closing_date ? new Date(d.closing_date).toLocaleDateString() : 'Pending',
    'Created Date': new Date(d.created_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Deals');

  XLSX.writeFile(workbook, `RealtyPulse_Financial_Deals_${Date.now()}.xlsx`);
};

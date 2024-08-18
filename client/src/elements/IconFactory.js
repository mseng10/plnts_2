import React from 'react';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HomeIcon from '@mui/icons-material/Home';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import MenuIcon from '@mui/icons-material/Menu';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import TungstenSharpIcon from '@mui/icons-material/TungstenSharp';
import MergeTypeSharpIcon from '@mui/icons-material/MergeTypeSharp';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import InvertColorsSharpIcon from '@mui/icons-material/InvertColorsSharp';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import AvTimerSharpIcon from '@mui/icons-material/AvTimerSharp';
import StraightenSharpIcon from '@mui/icons-material/StraightenSharp';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import EditSharp from '@mui/icons-material/Edit'
import PieChartOutlineSharpIcon from '@mui/icons-material/PieChartOutlineSharp';
import InsightsSharpIcon from '@mui/icons-material/InsightsSharp';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';

const IconFactory = ({ icon, color, size }) => {
  const sizeChart = {
    "sm": "small_button",
    "md": "medium_button",
    "xlg": "left_button",
    "xxxlg": "home_icon_form"
    // Add more sizes as needed
  };

  // Determine which icon to render based on 'icon' prop
  let IconComponent;
  switch (icon) {
  case 'view':
    IconComponent = VisibilitySharpIcon;
    break;
  case 'alert':
    IconComponent = ReportGmailerrorredSharpIcon;
    break;
  case 'home':
    IconComponent = HomeIcon;
    break;
  case 'create':
    IconComponent = AddSharpIcon;
    break;
  case 'menu':
    IconComponent = MenuIcon;
    break;
  case 'plant':
    IconComponent = GrassOutlinedIcon;
    break;
  case 'type':
    IconComponent = MergeTypeSharpIcon;
    break;
  case 'system':
    IconComponent = PointOfSaleIcon;
    break;
  case 'todo':
    IconComponent = FormatListNumberedIcon;
    break;
  case 'light':
    IconComponent = TungstenSharpIcon;
    break;
  case 'genus':
    IconComponent = FingerprintSharpIcon;
    break;
  case 'close':
    IconComponent = CloseSharpIcon;
    break;
  case 'check':
    IconComponent = CheckSharpIcon;
    break;
  case 'humidity':
    IconComponent = InvertColorsSharpIcon;
    break;
  case 'temperature':
    IconComponent = DeviceThermostatSharpIcon;
    break;
  case 'duration':
    IconComponent = AvTimerSharpIcon;
    break;
  case 'distance':
    IconComponent = StraightenSharpIcon;
    break;
  case 'water':
    IconComponent = WaterDropOutlinedIcon;
    break;
  case 'kill':
    IconComponent = DeleteOutlineSharpIcon;
    break;
  case 'edit':
    IconComponent = EditSharp;
    break;
  case 'mix':
    IconComponent = PieChartOutlineSharpIcon;
    break;
  case 'stats':
    IconComponent = InsightsSharpIcon;
    break;
  case 'cost':
    IconComponent = AttachMoneySharpIcon;
    break;
  // Add more cases for other icons
  default:
    IconComponent = VisibilitySharpIcon; // Default to VisibilitySharpIcon if no valid 'icon' prop is provided
  }

  return (
    <div>
      <IconComponent color={color} className={sizeChart[size]} />
    </div>
  );
};

export default IconFactory;

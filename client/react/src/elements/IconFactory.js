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

const IconFactory = ({ icon, color, size }) => {
  const sizeChart = {
    "sm": "small_button",
    "md": "medium_button",
    // Add more sizes as needed
  };

  // Determine which icon to render based on 'icon' prop
  let IconComponent;
  switch (icon) {
  case 'VisibilitySharp':
    IconComponent = VisibilitySharpIcon;
    break;
  case 'ReportGmailerrorredSharp':
    IconComponent = ReportGmailerrorredSharpIcon;
    break;
  case 'Home':
    IconComponent = HomeIcon;
    break;
  case 'Create':
    IconComponent = AddSharpIcon;
    break;
  case 'Menu':
    IconComponent = MenuIcon;
    break;
  case 'Plant':
    IconComponent = GrassOutlinedIcon;
    break;
  case 'Type':
    IconComponent = MergeTypeSharpIcon;
    break;
  case 'System':
    IconComponent = PointOfSaleIcon;
    break;
  case 'TODO':
    IconComponent = FormatListNumberedIcon;
    break;
  case 'Light':
    IconComponent = TungstenSharpIcon;
    break;
  case 'Genus':
    IconComponent = FingerprintSharpIcon;
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

import React, { Component } from "react";
import {
  Typography,
  ListItemText,
  Avatar,
  ListItemAvatar,
  ListItem,
  List,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SaveIcon from "@mui/icons-material/Save";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import SourceIcon from "@mui/icons-material/Source";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";
import strings from "../../strings/es.json";

class MetadataList extends Component {
  render() {
    return (
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <DescriptionIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.description}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.description}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PeopleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.authors}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.authors}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountBalanceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.institution}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.institution}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SaveIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.size}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.size}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AspectRatioIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.resolution}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.resolution}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EditAttributesIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.attributes}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.attributes}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SourceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.sources}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.sources}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <DateRangeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.date}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.date}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PlaceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">{strings.place}</Typography>
            }
            secondary={
              <Typography variant="body2">
                {this.props.metadata.place}
              </Typography>
            }
          />
        </ListItem>
      </List>
    );
  }
}

export default MetadataList;

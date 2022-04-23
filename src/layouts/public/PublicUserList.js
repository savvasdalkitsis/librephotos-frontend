import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Divider, Grid, Header, Icon, Image } from "semantic-ui-react";

import { fetchPublicUserList } from "../../actions/publicActions";
import { serverAddress } from "../../api_client/apiClient";
import { SideMenuNarrow } from "../../components/menubars/SideMenuNarrow";
import { SideMenuNarrowPublic } from "../../components/menubars/SideMenuNarrowPublic";
import { TopMenu } from "../../components/menubars/TopMenu";
import { TopMenuPublic } from "../../components/menubars/TopMenuPublic";
import { LEFT_MENU_WIDTH, TOP_MENU_HEIGHT } from "../../ui-constants";

export class PublicUserList extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPublicUserList());
  }

  render() {
    let menu;
    if (this.props.auth.access) {
      menu = (
        <div>
          {this.props.ui.showSidebar && <SideMenuNarrow />}
          <TopMenu />
        </div>
      );
    } else {
      menu = (
        <div>
          {this.props.ui.showSidebar && <SideMenuNarrowPublic />}
          <TopMenuPublic />
        </div>
      );
    }
    return (
      <div>
        {menu}
        <div
          style={{
            paddingTop: TOP_MENU_HEIGHT,
            paddingLeft: this.props.ui.showSidebar ? LEFT_MENU_WIDTH + 5 : 5,
          }}
        >
          <div style={{ height: 60, paddingTop: 10 }}>
            <Header as="h2">
              <Icon name="user circle" />
              <Header.Content>
                Users <Header.Subheader>Showing {this.props.pub.publicUserList.length} users</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
          <div style={{ padding: 10 }}>
            {this.props.pub.publicUserList.map((el, idx) => {
              let displayName;
              if (el.first_name.length > 0 && el.last_name.length > 0) {
                displayName = `${el.first_name} ${el.last_name}`;
              } else {
                displayName = el.username;
              }

              return (
                <div style={{ padding: 10 }}>
                  <Header as={Link} to={`/user/${el.username}/`}>
                    <Image circular src="/unknown_user.jpg" />
                    <Header.Content>
                      {displayName}
                      <Header.Subheader>{el.public_photo_count} public photos</Header.Subheader>
                    </Header.Content>
                  </Header>
                  {false && (
                    <Grid doubling stackable>
                      <Divider />
                      <Grid.Row columns={this.props.ui.gridType === "dense" ? 5 : 3}>
                        {el.public_photo_samples.slice(0, this.props.ui.gridType === "dense" ? 10 : 6).map(photo => (
                          <Grid.Column>
                            <Image src={`${serverAddress}/media/square_thumbnails/${photo.image_hash}.jpg`} />
                            <Divider hidden />
                          </Grid.Column>
                        ))}
                      </Grid.Row>
                    </Grid>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

PublicUserList = connect(store => ({
  pub: store.pub,
  ui: store.ui,
  auth: store.auth,
}))(PublicUserList);

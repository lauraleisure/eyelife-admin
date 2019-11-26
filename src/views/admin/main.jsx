import React,{Component} from 'react'
// import PropTypes from 'prop-types';
import {connect} from "react-redux";
// import  Q from 'q';
import 'antd/dist/antd.css';
import { Layout, Menu,Breadcrumb, Icon } from 'antd';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class Main extends Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentWillMount(){

   }
   componentDidMount(){

   }
    render() {
        return (
            <Layout className="noScrollDiv">
                {/*左侧菜单 start*/}
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className='flex-box ai-c'>
                        <div className="logo"/>
                        <Icon style={{color:'#fff' }}
                              className="trigger"
                              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                              onClick={this.toggle}
                        />
                    </div>
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span>系统配置</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <span><Icon type="user" /><span>用户数据</span></span>
                            }
                        >
                            <Menu.Item key="user_role">角色管理</Menu.Item>
                            <Menu.Item key="user_privilege">权限分配</Menu.Item>
                            <Menu.Item key="user_list">用户列表</Menu.Item>
                            <Menu.Item key="user_list">岗位设置</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span><Icon type="user"  className=""/><span>员工大学</span></span>
                            }
                        >
                            <Menu.Item key="course_category">课程分类</Menu.Item>
                            <Menu.Item key="course_content">云知识库</Menu.Item>
                            <Menu.Item key="course_exam">云试题库</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span><Icon type="user"  className=""/><span>员工培训</span></span>
                            }
                        >
                            <Menu.Item key="employee_handbook">员工手册</Menu.Item>
                            <Menu.Item key="job_responsibility">岗位职责</Menu.Item>
                            <Menu.Item key="training_plan">培训计划</Menu.Item>

                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span><Icon type="snippets" class="employee_assess" /><span>员工考核</span></span>
                            }
                        >
                            <Menu.Item key="employee_attendance">考勤管理</Menu.Item>
                            <Menu.Item key="employee_task">工作日报</Menu.Item>
                            <Menu.Item key="employee_project">工作计划</Menu.Item>
                            <Menu.Item key="employee_project">在线学习</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="2">
                            <Icon type="line-chart" />
                            <span>页面配置</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                        <Icon type="pie-chart" />
                        <span>系统配置</span>
                    </Menu.Item>
                    </Menu>
                </Sider>
                {/*左侧菜单 end*/}
                <Layout>
                    <Header className="header-nav flex-box jc-e ai-c" style={{color:'#fff'}}>
                        <div className="menu-item username">Admin</div>
                        <div className="menu-item logout"><a href="#">退出</a></div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default connect(state=>({}),
    {})(Main)

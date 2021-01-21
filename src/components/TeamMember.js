import React from "react";

class TeamMember extends React.Component {
  render() {
    return (
      <div className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2">
        <div className="flex items-center px-5 py-3 mb-4 mr-0 border border-gray-200 rounded-lg md:mr-4 lg:mr-0 xl:mr-4">
          <img
            className="object-cover w-24 h-24 mr-4 border-2 border-gray-200 rounded-full"
            src={this.props.img}
          />
          <div>
            <p className="font-semibold">{this.props.name}</p>
            <p className="leading-tight text-gray-500">{this.props.role}</p>
            {/* <ul className="flex pt-1">
              <li key="1">
                <a href={this.props.linkedin}></a>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    );
  }
}

export default TeamMember;

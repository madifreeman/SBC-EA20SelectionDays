import Airtable from "airtable";
import TextInput from "../../../src/components/TextInput";
import Header from "../../../src/components/Header";
import Footer from "../../../src/components/Footer";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import CustomizedSlider from "../../../src/components/FeedbackSlider";
import { Slider } from "@material-ui/core";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export async function getStaticPaths() {
  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Startups")
    .select({
      fields: ["Slug"],
    })
    .all();
  const paths = records.map((record) => {
    return {
      params: {
        slug: record.get("Slug"),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const records = await airtable
    .base("appzJwVbIs7gBM2fm")("Startups")
    .select({
      filterByFormula: `Slug="${params.slug}"`,
    })
    .all();

  const startup = {
    name: records[0].get("Name") || "",
    slug: records[0].get("Slug") || "",
    image: records[0].get("Photo") ? records[0].get("Photo")[0].url : "",
    city: records[0].get("City") || "",
    country: records[0].get("Country") || "",
    description: records[0].get("Short Description") || "",
  };
  return {
    props: { startup },
  };
}

class SectionHeading extends React.Component {
  render() {
    return (
      <div className="border-b-4 border-gray-200">
        <h2 className="pt-4 pb-4 text-xl font-semibold text-gray-700">
          {this.props.heading}

          {this.props.description ? (
            <p className="py-2 font-normal text-sm">{this.props.description}</p>
          ) : null}
        </h2>
      </div>
    );
  }
}

class FieldTitle extends React.Component {
  render() {
    return (
      <span className="font-semibold text-base text-gray-700">
        {this.props.fieldName}
        {this.props.required ? (
          <span className="text-red-600"> *</span>
        ) : (
          <span className="text-gray-500 text-xs font-normal"> (optional)</span>
        )}
      </span>
    );
  }
}

class RadioButtons extends React.Component {
  render() {
    return (
      <fieldset className="my-6" name={this.props.fieldName}>
        <FieldTitle
          fieldName={this.props.fieldName}
          required={this.props.required}
        />
        {this.props.options.map((option) => {
          return (
            <div className="mt-2 ml-3" key={option}>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  className="w-4 h-4 text-teal-500 cursor-pointer form-radio"
                  type="radio"
                  value={option}
                  name={this.props.fieldId}
                  ref={this.props.rhfRef}
                />
                <span className="ml-3 font-light">{option}</span>
              </label>
            </div>
          );
        })}
      </fieldset>
    );
  }
}

class LongTextInput extends React.Component {
  render() {
    return (
      <div className="my-6">
        <FieldTitle
          fieldName={this.props.fieldName}
          required={this.props.required}
        />
        <textarea
          className="mt-2 inline-block w-full px-2 py-1 bg-white border-2 border-gray-200 rounded-sm"
          rows={4}
          name={this.props.fieldId}
          ref={this.props.rhfRef}
        />
      </div>
    );
  }
}

class SliderFieldInput extends React.Component {
  render() {
    return (
      <div className="my-6">
        <FieldTitle
          fieldName={this.props.fieldName}
          required={this.props.required}
        />
        <div className="w-full mt-10 px-2 py-2">
          <CustomizedSlider rhfRef={this.props.rhfRef} fieldId={this.props.fieldId} />
          <div className="pt-4 flex justify-between font-semibold text-gray-600">
            <small>{this.props.minName}</small>
            <small>{this.props.maxName}</small>
          </div>
        </div>
      </div>
    );
  }
}

export default function LeaveFeedback({ startup }) {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div>
      <Header height="36" />
      <div className="relative px-4 pb-2 xs:px-8">
        <div className="container mx-auto ">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-2/5 xl:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center md:flex-nowrap lg:flex-wrap md:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto border-2 border-gray-200 rounded-full md:mx-0 lg:mx-auto"
                    src={startup.image}
                  />

                  <div className="w-full pt-4 pl-0 mx-auto md:w-auto lg:w-full md:mx-0 lg:mx-auto md:pl-8 lg:pl-0 md:pt-0 lg:pt-4">
                    <h1 className="text-2xl font-semibold">{startup.name}</h1>
                    <p className="text-gray-500 text-xl">
                      {startup.city + ", " + startup.country}
                    </p>
                    <p className="pt-4">{startup.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 xl:w-2/3">
              <div className="px-3 pt-8 lg:pt-0">
                <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                  <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
                    Leave feedback for {startup.name}
                  </h1>
                  <p className="pt-4">
                    The information you enter below will be shared with the
                    startup. If you like, you will have the option to anonymise
                    your feedback at the end of the form.
                  </p>
                  <form className="pt-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="pt-4">
                      <SectionHeading heading="Team & Ability" />
                      <SliderFieldInput
                        fieldName="Does the team have in-depth industry knowledge?"
                        fieldId="knowledge"
                        minName="Little Knowledge"
                        maxName="Very Knowledgeable"
                        rhfRef={register}
                        required={true}
                      />
                      <SliderFieldInput
                        fieldName="Does the team have the passion and vision to make their idea successful?"
                        fieldId="passion"
                        minName="Low passion"
                        maxName="High passion"
                        rhfRef={register}
                        required={true}
                      />
                      <SliderFieldInput
                        fieldName="Does this team have the ability to deliver their idea?"
                        fieldId="ability"
                        minName="Low ability"
                        maxName="High ability"
                        rhfRef={register}
                        required={true}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Market & Product" />
                      <SliderFieldInput
                        fieldName="How big is the teams potential market?"
                        fieldId="market"
                        minName="Local Scale"
                        maxName="Global Scale"
                        rhfRef={register}
                        required={true}
                      />
                      <SliderFieldInput
                        fieldName="Is the market competitive?"
                        fieldId="competitive"
                        minName="Many competitors"
                        maxName="No competitors"
                        rhfRef={register}
                        required={true}
                      />
                      <RadioButtons
                        fieldName="What do you think of this team's product or service?"
                        fieldId="product"
                        options={["Very good", "Average", "Weak"]}
                        required={true}
                        rhfRef={register}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Execution Power" />
                      <SliderFieldInput
                        fieldName="How much market traction does the team have?"
                        fieldId="traction"
                        minName="No users/customers"
                        maxName="Paying users/customers"
                        rhfRef={register}
                        required={true}
                      />
                      <SliderFieldInput
                        fieldName="How strong is the team's branding and story?"
                        fieldId="marketing"
                        minName="Very Weak"
                        maxName="Very Strong"
                        rhfRef={register}
                        required={true}
                      />
                      <SliderFieldInput
                        fieldName="How strong is the team's presentation skills?"
                        fieldId="presentation"
                        minName="Very Weak"
                        maxName="Very Strong"
                        rhfRef={register}
                        required={true}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Strategic & Funding" />
                      <RadioButtons
                        fieldName="Would you invest in this startup?"
                        fieldId="invest"
                        options={[
                          "Yes, I'd like to discuss potential investment",
                          "Yes, if I had the money available",
                          "No",
                        ]}
                        required={true}
                        rhfRef={register}
                      />
                      <RadioButtons
                        fieldName="Do you want to mentor this startup during the upcoming program?"
                        fieldId="mentoring"
                        options={["Yes", "No"]}
                        required={true}
                        rhfRef={register}
                      />
                      <LongTextInput
                        fieldName="Are there any companies and/or people you'd like to connect this startup with?"
                        fieldId="connect"
                        required={false}
                        rhfRef={register}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Feedback" />
                      <LongTextInput
                        fieldName="Do you have any comments you'd like to share with the startup?"
                        fieldId="comments"
                        required={false}
                        rhfRef={register}
                      />
                      <RadioButtons
                        fieldName="Your above feedback will be shared with the startup. Would you like to make it anonymous?"
                        fieldId="anonymous"
                        options={["Yes", "No"]}
                        required={true}
                        rhfRef={register}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading
                        heading="Concerns"
                        description="The information you enter below will remain private and WILL NOT be shared with the startup."
                      />
                      <LongTextInput
                        fieldName="Did this startup raise any red flags with you? If so, please explain?"
                        fieldId="concerns"
                        required={false}
                        rhfRef={register}
                      />
                    </div>

                    <input
                      type="submit"
                      className="block px-8 py-3 mt-16 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-md cursor-pointer hover:bg-teal-600 hover:shadow-lg"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
import Head from 'next/head';

import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Meetups App</title>
        <meta name='description' content="Let's add places to meet-up and get along" />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

// export const getServerSideProps = async (context) => {
//     const req = context.req;
//     const res = context.res;

//     return {
//         props: {
//            meetups: DUMMY_MEETUPS
//         }
//     };
// };

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    'mongodb+srv://Kenichi:FunnyDay2015@cluster0.owkobmm.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;

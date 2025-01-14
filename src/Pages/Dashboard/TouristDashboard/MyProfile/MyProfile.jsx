import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Textarea,
  Chip,
} from "@material-tailwind/react";
import useAuth from "../../../../Hooks/useAuth";
import useAxios from "../../../../Hooks/useAxios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { MenuItem, Select } from "@mui/material";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import ReviewCard from "../../../../Components/ReviewCard/ReviewCard";
import SectionTitle from "../../../../Shared/SectionTitle/SectionTitle";
import useGuide from "../../../../Hooks/useGuide";
import useAdmin from "../../../../Hooks/useAdmin";

const MyProfile = () => {
  const { isGuide } = useGuide();
  const { isAdmin } = useAdmin();

  console.log(isAdmin);
  const user = useAuth();
  //   console.log(user);
  const { axiosSecure, axiosPublic } = useAxios();

  const { data: guides } = useQuery({
    queryKey: "guides",
    queryFn: async () => {
      const res = await axiosSecure.get("/guides");
      return res.data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/comments?email=${user?.email}`);
      return res.data;
    },
  });

  const [guide, setGuide] = useState({});

  const handleStory = event => {
    event.preventDefault();
    const storyInfo = {
      spotName: event.target.spotName.value,
      tourType: event.target.tourType.value,
      email: user.email,
      experience: event.target.experience.value,
      photoURL: user.photoURL,
      images: [
        event.target.image1.value,
        event.target.image2.value,
        event.target.image3.value,
        event.target.image4.value,
      ],
      guideName: guide.target.value.name,
      name: user.displayName,
      date: event.target.date.value,
    };

    console.log(guide.target.value);

    Swal.fire({
      title: "Are you sure?",
      text: `You want to Add the story ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add it!",
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure
          .post("/story", storyInfo)
          .then(res => {
            Swal.fire({
              icon: "success",
              title: "Success!!",
              text: "The Package Booked For You",
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.message,
            });
          });
      }
    });
  };

  return (
    <div className="my-10">
      <Card className="md:w-10/12 mx-auto border-t shadow-lg">
        <CardHeader
          floated={false}
          className="h-96 flex items-center justify-center border-t "
        >
          <img
            className="w-80 h-80 mx-auto rounded-full"
            src={user?.photoURL}
            alt={user?.displayName}
          />
        </CardHeader>
        <CardBody className="text-center">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {user?.displayName}
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient>
            Email : {user?.email}
          </Typography>
          <Typography color="blue-gray" className="font-lg" textGradient>
            {isAdmin && (
              <Chip
                variant="ghost"
                color="green"
                value="Admin"
                className="inline-block my-2"
              />
            )}
            {isGuide && (
              <Chip
                variant="ghost"
                color="green"
                value="Guide"
                className="inline-block my-2"
              />
            )}
            {!isGuide && !isAdmin && (
              <Chip
                variant="ghost"
                color="green"
                value="Tourist"
                className="inline-block my-2"
              />
            )}
          </Typography>
        </CardBody>
        {!isAdmin && !isGuide && (
          <CardFooter className="">
            <h1 className="text-center font-semibold my-5 mx-auto">
              Add your Own Story
            </h1>
            <form onSubmit={handleStory} className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
                <Input
                  variant="outlined"
                  label="Spot Name"
                  name="spotName"
                  required
                />
                <Input
                  variant="outlined"
                  label="Tour Type"
                  // placeholder="Outlined"
                  name="tourType"
                  required
                />
                <Select
                  label="Guide"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  onChange={e => setGuide(e)}
                  className="text-black"
                  placeholder="Select Guide"
                >
                  {guides?.map(guide => (
                    <MenuItem
                      value={{ email: guide.email, name: guide.name }}
                      key={guide._id}
                      required
                      name={guide}
                    >
                      {guide.name}
                    </MenuItem>
                  ))}
                </Select>
                <Input
                  type="date"
                  variant="outlined"
                  label="Tour Date"
                  // placeholder="Outlined"
                  name="date"
                  required
                />
                <Input
                  variant="outlined"
                  label="image 1"
                  required
                  // placeholder="Outlined"
                  name="image1"
                />
                <Input
                  variant="outlined"
                  label="Image 2"
                  // placeholder="Outlined"
                  name="image2"
                  required
                />
                <Input
                  variant="outlined"
                  label="Image 3"
                  // placeholder="Outlined"
                  name="image3"
                  required
                />
                <Input
                  variant="outlined"
                  label="Image 4"
                  // placeholder="Outlined"
                  name="image4"
                  required
                />
                <div className="md:col-span-2">
                  <Textarea
                    variant="outlined"
                    label="Share Your Experience"
                    name="experience"
                    required={true}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="gradient"
                color="red"
                className="bg-red-500"
                fullWidth
              >
                Add Story
              </Button>
            </form>
          </CardFooter>
        )}
        {isGuide && (
          <CardFooter className="">
            <h1 className="text-center font-semibold my-5 mx-auto">
              Add your Profile
            </h1>
            <form onSubmit={handleStory} className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
                <Input
                  variant="outlined"
                  label="Spot Name"
                  name="spotName"
                  required
                />
                <Input
                  variant="outlined"
                  label="Tour Type"
                  // placeholder="Outlined"
                  name="tourType"
                  required
                />
                
              </div>
              <Button
                type="submit"
                variant="gradient"
                color="red"
                className="bg-red-500"
                fullWidth
              >
                Add Story
              </Button>
            </form>
          </CardFooter>
        )}
      </Card>
      {isGuide && (
        <div className="my-10 w-11/12 mx-auto">
          <div className="my-10">
            <SectionTitle title="Tourist Revies About You" />
          </div>
          <Swiper
            freeMode={true}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination]}
            className="mySwiper py-20"
          >
            {reviews?.map(review => (
              <SwiperSlide key={review._id}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

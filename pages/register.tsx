import IUserRegisterDTO from "@/model/user/IUserRegisterDTO";
import { register } from "@/service/userService";
import { LinearProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { serialize } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<IUserRegisterDTO>({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation<string, Error>({
    mutationKey: ["register-mutation"],
    mutationFn: async () => await register(userInfo),
    onSuccess: () => {
      router.push("/home");
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          minHeight: "50vh",
          minWidth: "30vw",
          borderRadius: "25px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        }}
      >
        <form>
          <CardHeader title="Register" sx={{ textAlign: "center" }} />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <TextField
                label="Name"
                variant="outlined"
                value={userInfo.nome}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, nome: e.target.value })
                }
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <TextField
                label="Surname"
                variant="outlined"
                value={userInfo.cognome}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, cognome: e.target.value })
                }
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <TextField
                type={"email"}
                label="Email"
                variant="outlined"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <TextField
                type={"password"}
                label="Password"
                variant="outlined"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disabled={registerMutation.isLoading}
              color={"primary"}
              onClick={(e) => {
                e.preventDefault();
                registerMutation.mutate();
              }}
            >
              Register
            </Button>
            <Link
              href={"/"}
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              <Button variant="contained" disabled={registerMutation.isLoading}>
                Torna alla login
              </Button>
            </Link>
          </CardActions>
        </form>
        {registerMutation.isLoading ? <LinearProgress color="primary" /> : null}
        {registerMutation.isError ? (
          <Typography
            color={"error"}
            align="center"
            variant="h5"
            marginBottom={"20px"}
            marginTop={"20px"}
          >
            {registerMutation.error.message}
          </Typography>
        ) : null}
      </Card>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session) return { props: {} };
  try {
    const { status } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ROOT}/auth/session`,
      {
        withCredentials: true,
        headers: {
          cookie: serialize("session", req.cookies.session),
        },
      }
    );
    if (status == 200)
      return {
        redirect: { permanent: false, destination: "/home" },
        props: {},
      };
    return {
      props: {},
    };
  } catch (error) {
    console.log("ERRORE:", error);
    return { props: {} };
  }
};

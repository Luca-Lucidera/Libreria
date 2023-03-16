import style from "@/styles/index.module.css";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/service/userService";
import { useRouter } from "next/router";
import IUser from "@/interfaces/user/IUser";
import { GetServerSideProps } from "next";
import { serialize } from "cookie";
import Link from "next/link";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardActions,
  CardContent,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spinLoading, setSpinLoading] = useState(false)
  const router = useRouter();
  const loginMutation = useMutation<IUser, Error>({
    mutationFn: async () => {
      setSpinLoading(true)
      return await login({ email, password })
    },
    onSuccess: (user) => {
      setSpinLoading(false)
      router.push("/home");
    },
    onError: () => {
      setSpinLoading(false)
    },
    cacheTime: 0,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate();
  }
  return (
    <div className={style.outer_div}>
      <Card className={style.card}>
        <CardContent>
          <Typography variant="h4" align="center">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className={style.form_input_separator}>
              <TextField
                type={"email"}
                id="email"
                label={"Email"}
                size={"small"}
                placeholder={"mario.rossi@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={style.form_input_separator}>
              <TextField
                type={"password"}
                id="password"
                label={"Password"}
                size={"small"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginMutation.isError ? (
              <Typography align="center" sx={{ color: "red", paddingTop: 2 }}>
                <div>{loginMutation.error.message}</div>
              </Typography>
            ) : null}
            <div className={style.form_input_separator}>
              <CardActions className={style.card_action}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loginMutation.isLoading}
                  color={"primary"}
                >
                  Login
                </Button>
                <Link href={"/register"} className={style.spacer_btn}>
                  <Button variant="contained" disabled={loginMutation.isLoading}>Registrati</Button>
                </Link>
              </CardActions>
            </div>
          </form>
        </CardContent>
      </Card>
      <Backdrop
        open={spinLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.session) return { props: {} };
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
    return { redirect: { permanent: false, destination: "/home" }, props: {} };
  return {
    props: {},
  };
};

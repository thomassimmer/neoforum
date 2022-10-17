import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PasswordCheck from "./PasswordCheck";
import "./style.css";


const theme = createTheme();

const SignUpForm = ({
    history,
    onSubmit,
    onChange,
    errors,
    user,
    score,
    btnTxt,
    type,
    pwMask,
    onPwChange,
    switchForm
}) => {
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    autoFocus
                                    name="username"
                                    label="Username"
                                    value={user.username}
                                    onChange={onChange}
                                    error={errors.username !== undefined}
                                    helperText={errors.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={user.email}
                                    onChange={onChange}
                                    error={errors.email !== undefined}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={type}
                                    id="password"
                                    autoComplete="new-password"
                                    value={user.password}
                                    onChange={onPwChange}
                                    error={errors.password !== undefined}
                                    helperText={errors.password}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    className="pwShowHideBtn"
                                    onClick={pwMask}
                                >
                                    {btnTxt}
                                </Button>
                            </Grid>
                            <div className="pwStrRow">
                                {score >= 1 && (
                                    <div>
                                        <PasswordCheck score={score} />
                                    </div>
                                )}
                            </div>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    type={type}
                                    name="pwconfirm"
                                    label="Confirm password"
                                    value={user.pwconfirm}
                                    onChange={onChange}
                                    error={errors.pwconfirm !== undefined}
                                    helperText={errors.pwconfirm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            label="submit"
                            className="signUpSubmit"
                            fullWidth
                            variant="contained"
                            primary={true}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" onClick={switchForm} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default SignUpForm;

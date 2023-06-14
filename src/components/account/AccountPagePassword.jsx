// react
import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl, FormattedMessage } from 'react-intl';

// third-party
import { Helmet } from 'react-helmet-async';

// data stubs
import theme from '../../data/theme';

// api
import { editUserInfo } from '../../api/auth';
import { toastSuccess, toastError } from '../toast/toastComponent';

function AccountPagePassword({ auth }) {
    const { name, email, phone } = auth.user;
    const intl = useIntl();
    const formik = useFormik({
        initialValues: {
            password: '',
            repeatPassword: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            password: Yup.string().min(6, intl.formatMessage({ id: 'validation.password.format' })).required(intl.formatMessage({ id: 'validation.repeatPassword.required' })),
            repeatPassword: Yup.string().oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'validation.repeatPassword.format' })),
        }),
        onSubmit: (values) => {
            const { password, repeatPassword } = values;
            const payload = {
                name, email, phone, password, confirmPassword: repeatPassword,
            };
            editUserInfo(payload, (success) => {
                if (success.success) {
                    toastSuccess(success);
                } else {
                    toastError(success);
                }
            }, (fail) => toastError(fail));
        },
    });

    return (
        <div className="card">
            <Helmet>
                <title>{`Change Password — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5><FormattedMessage id="changePassword" defaultMessage="Change Password" /></h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <form className="col-12 col-lg-7 col-xl-6 needs-validation" onSubmit={formik.handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="password-new">{intl.formatMessage({ id: 'newPassword' })}</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password-new"
                                placeholder={intl.formatMessage({ id: 'newPassword' })}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password
                                ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.password}
                                    </div>
                                )
                                : null }
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-confirm">{intl.formatMessage({ id: 'reenterPassword' })}</label>
                            <input
                                type="password"
                                name="repeatPassword"
                                className="form-control"
                                id="password-confirm"
                                placeholder={intl.formatMessage({ id: 'reenterPassword' })}
                                value={formik.values.repeatPassword}
                                onChange={formik.handleChange}
                                {...formik.getFieldProps('repeatPassword')}
                            />
                            {formik.touched.repeatPassword && formik.errors.repeatPassword
                                ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.repeatPassword}
                                    </div>
                                )
                                : null }
                        </div>
                        <div className="form-group mt-5 mb-0">
                            <button type="submit" className="btn btn-primary">
                                {intl.formatMessage({ id: 'change' })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = (state) => ({
    auth: state.auth,
});
export default connect(mapStateToProps)(AccountPagePassword);

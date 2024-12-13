# Security Policies and Procedures

This document outlines the security procedures and general policies for Vector. We appreciate your commitment to improving our security posture by responsibly disclosing potential issues.

- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Responsible Testing Guidelines](#responsible-testing-guidelines)
- [Disclosure and Resolution Process](#disclosure-and-resolution-process)
- [Severity Characterization](#severity-characterization)
- [Rewards](#rewards)
- [Comments on this Policy](#comments-on-this-policy)

## Reporting a Vulnerability

At Vector, the security of our ecosystem is paramount, and we greatly appreciate individuals who responsibly identify and report potential vulnerabilities.

**Please do not disclose security issues publicly (e.g., GitHub issues) before we have had the opportunity to investigate and respond.** Instead, choose one of the following private reporting methods:

1. **Email:** Send a detailed report to `security@seraphim.zone`.

2. **GitHub Private Vulnerability Reporting (if available):** Use GitHub’s private reporting tools (if enabled for this repository) to confidentially share details of the vulnerability.

In either case, please include:
   - A clear description of the vulnerability. 
   - Steps to reliably reproduce the issue. 
   - An explanation of the potential impact.  
   - Any recommended mitigation strategies. 

We will acknowledge your report within **48 hours**. From there, we’ll keep you informed of our progress, collaborate with you on testing possible solutions, and let you know once the fix is deployed.

If the issue originates from a third-party component, please contact the maintainers of that component directly.

## Responsible Testing Guidelines

- **Do not test vulnerabilities in production or publicly accessible environments.** This includes main networks, frontends, and public testnets. Such testing could negatively impact real users or sensitive data.
  
- **Refrain from using public forums or social media to disclose vulnerabilities.** Publicly sharing details before a fix is in place can expose users and systems to unnecessary risk.

Your cooperation helps maintain a secure and stable environment for everyone.

## Disclosure and Resolution Process

Once we receive a report, a primary contact person (handler) is assigned to guide the resolution process. Generally, we will:

1. **Confirmation:** Verify the issue’s existence and identify affected versions.
2. **Assessment:** Determine its severity level (see [Severity Characterization](#severity-characterization)).
3. **Remediation:** Implement, test, and finalize a suitable fix.
4. **Deployment:** Coordinate a secure release of the patch and any related announcements.
5. **Notification:** Once resolved, we may disclose details publicly, ensuring the risk no longer exists for users.

We kindly request that you keep details of the vulnerability private until the fix is fully deployed. If a chain upgrade or major release is required, we will communicate timelines and may require additional coordination.

## Severity Characterization

| Severity     | Description                                                                      |
|--------------|----------------------------------------------------------------------------------|
| **CRITICAL** | Immediate threat to critical systems (e.g., chain halts, potential loss of funds) |
| **HIGH**     | Substantially impacts key functionality or system integrity                       |
| **MEDIUM**   | Affects secondary features or reveals limited, non-sensitive information          |
| **LOW**      | Has a minor impact, with little to no serious security implications                 |

## Rewards

While we do not have a formal bug bounty program, we may consider providing a reward at our discretion, especially for critical or high-severity findings. Compensation might require a KYC process and may not be offered if vulnerabilities are disclosed prematurely or tested irresponsibly.

## Comments on this Policy

We welcome input on how to improve these policies. If you have suggestions or feedback, please open a pull request or email `security@seraphim.zone`.

----

**Version: 1.0.0**

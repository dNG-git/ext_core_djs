# -*- coding: utf-8 -*-

"""
direct JavaScript Toolbox
All-in-one toolbox for HTML5 presentation and manipulation
----------------------------------------------------------------------------
(C) direct Netware Group - All rights reserved
https://www.direct-netware.de/redirect?js;djt

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at http://mozilla.org/MPL/2.0/.
----------------------------------------------------------------------------
https://www.direct-netware.de/redirect?licenses;mpl2
----------------------------------------------------------------------------
setup.py
"""

def get_version():
    """
Returns the version currently in development.

:return: (str) Version string
:since:  v0.1.03
    """

    return "v0.1.03"
#

from dNG.distutils.command.install_data import InstallData
from dNG.distutils.command.install_js_data import InstallJsData
from dNG.distutils.temporary_directory import TemporaryDirectory

from distutils.core import setup

with TemporaryDirectory(dir = ".") as build_directory:
    css_js_copyright = "djt #echo(jsDjtVersion)# - (C) direct Netware Group - All rights reserved"

    parameters = { "jsDjtVersion": get_version(),
                   "js_header": css_js_copyright, "js_min_filenames": True,
                   "js_strip_source_directory": True
                 }

    InstallData.add_install_data_callback(InstallJsData.callback, [ "src" ])
    InstallData.set_build_target_path(build_directory)
    InstallData.set_build_target_parameters(parameters)

    setup(name = "djt",
          version = get_version(),
          description = "All-in-one toolbox for HTML5 presentation and manipulation",
          long_description = """The "direct JavaScript Toolbox" contain a set of modules for HTML5 presentation and manipulation.""",
          author = "direct Netware Group et al.",
          author_email = "web@direct-netware.de",
          license = "MPL2",
          url = "https://www.direct-netware.de/redirect?js;djt",

          platforms = [ "any" ],

          data_files = [ ( "docs", [ "LICENSE", "README" ]) ],

          cmdclass = { "install_data": InstallData }
         )
#
